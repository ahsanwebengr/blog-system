require('dotenv').config();
const connectDB = require('../src/config/database');
const Blog = require('../src/models/Blog');

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/findBySlug.js <slug>');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) {
    console.log('NOT FOUND');
    process.exit(0);
  }
  console.log(JSON.stringify(blog, null, 2));
  process.exit(0);
};

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
