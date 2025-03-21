
export default function PageHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-100/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  )
}
