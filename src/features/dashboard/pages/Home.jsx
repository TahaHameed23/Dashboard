import HomeComponent from '../components/HomeComponent'
import TopBar from '../components/TopBar'
import { useDashboard } from '../context/DashboardContext'
import { EmptyDashboard } from '../components/EmptyDashboard';

const Home = () => {
  const { data, loading, error, newUser } = useDashboard();
    if(newUser){
      return <EmptyDashboard/>
    }
  return (
    <div>
      <TopBar />
      <HomeComponent data={data} loading={loading} error={error} newUser={newUser} />
    </div>
  )
}

export default Home