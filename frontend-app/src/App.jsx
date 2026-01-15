import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import BlogList from '@/pages/BlogList';
import BlogDetail from '@/pages/BlogDetail';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<BlogList />} />
          <Route path='/blog/:slug' element={<BlogDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
