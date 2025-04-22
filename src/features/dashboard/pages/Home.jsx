import HomeComponent from '../components/HomeComponent'
import TopBar from '../components/TopBar'
import { useDashboard } from '../context/DashboardContext'

const Home = () => {
  const { data, loading, error } = useDashboard();

  return (
    <div>
      <TopBar />
      <HomeComponent data={data} loading={loading} error={error} />
    </div>
  )
}

export default Home