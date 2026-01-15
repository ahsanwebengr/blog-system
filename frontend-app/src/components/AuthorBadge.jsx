export default function AuthorBadge({ name = 'Author', avatarUrl }) {
  return (
    <div className='flex items-center gap-3'>
      <div className='h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center'>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className='h-full w-full object-cover' />
        ) : (
          <span className='text-sm font-medium text-muted-foreground'>{name[0]}</span>
        )}
      </div>
      <div>
        <div className='text-sm font-medium'>{name}</div>
        <div className='text-xs text-muted-foreground'>Writer</div>
      </div>
    </div>
  );
}
