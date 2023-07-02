import { trpc } from '../utils/trpc'

const Index = () => {
  const helloQuery = trpc.hello.useQuery('world')
  if (helloQuery.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }
  if (helloQuery.isError) {
    return (
      <div>
        <p>Error: {helloQuery.error.message}</p>
      </div>
    )
  }
  return (
    <div>
      <p>React App</p>
      <p>{helloQuery.data.message}</p>
    </div>
  )
}

export default Index
