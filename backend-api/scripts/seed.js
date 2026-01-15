require('dotenv').config();
const connectDB = require('../src/config/database');
const Blog = require('../src/models/Blog');
const { faker } = require('@faker-js/faker');
const slugify = require('slugify');

const categories = ['Tech', 'Life', 'Travel', 'Food', 'Business', 'Education', 'Design'];
const tagsPool = [
  'react',
  'node',
  'javascript',
  'webdev',
  'tutorial',
  'tips',
  'career',
  'productivity',
  'design',
  'css',
  'testing',
  'mongodb',
];

const randomContent = title => {
  const paragraphs = Array.from({
    length: faker.datatype.number({ min: 3, max: 7 }),
  }).map(() => ({
    type: 'paragraph',
    content: [{ type: 'text', text: faker.lorem.paragraph() }],
  }));

  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: title }] },
      { type: 'paragraph', content: [{ type: 'text', text: faker.lorem.sentence() }] },
      ...paragraphs,
    ],
  };
};

const seed = async () => {
  await connectDB();

  const clear = process.env.CLEAR_BEFORE_SEED === 'true';
  if (clear) {
    console.log('Clearing existing blogs...');
    await Blog.deleteMany({});
  }

  const docs = [];
  // Track used slugs to avoid duplicates when using insertMany
  const usedSlugs = new Set();

  // Preload existing slugs from DB to avoid collisions with current data
  try {
    const existing = await Blog.find({}).select('slug').lean();
    existing.forEach(e => {
      if (e.slug) usedSlugs.add(e.slug);
    });
  } catch (err) {
    console.warn('Could not preload existing slugs, continuing:', err.message);
  }
  for (let i = 0; i < 200; i++) {
    const title = faker.lorem.sentence(6).replace(/\.$/, '');
    // generate unique slug (insertMany bypasses mongoose pre-save)
    let baseSlug = slugify(title, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);
    const summary = faker.lorem.sentences(2);
    const status = Math.random() < 0.8 ? 'published' : 'draft';
    const createdAt = faker.date.past(2);
    const publishedAt =
      status === 'published' ? faker.date.between(createdAt, new Date()) : null;
    const tags = faker.helpers.arrayElements(
      tagsPool,
      faker.datatype.number({ min: 1, max: 4 })
    );
    const category = faker.helpers.arrayElement(categories);
    const coverImage = { url: `https://picsum.photos/seed/blog${i}/800/450`, alt: title };
    const views = faker.datatype.number({ min: 0, max: 5000 });

    docs.push({
      title,
      slug,
      summary,
      content: randomContent(title),
      coverImage,
      tags,
      category,
      status,
      views,
      createdAt,
      publishedAt,
    });
  }

  console.log('Inserting 200 blogs...');
  await Blog.insertMany(docs);
  console.log('Seeding complete.');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
