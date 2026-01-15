import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import BlogList from '@/pages/BlogList';
import BlogCreate from '@/pages/BlogCreate';
import BlogEdit from '@/pages/BlogEdit';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Navigate to='/blogs' replace />} />
          <Route path='/blogs' element={<BlogList />} />
          <Route path='/blogs/create' element={<BlogCreate />} />
          <Route path='/blogs/edit/:id' element={<BlogEdit />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
