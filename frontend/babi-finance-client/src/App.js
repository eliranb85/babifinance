import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home/Home";
import Header from './components/Header/Header.jsx';
import CreateUser from './components/CreateUser/CreateUser';
import GoldPrice from './components/GoldPrice/GoldPrice.jsx';
import JewelryCalculator from './components/JewelryCalculator/JewelryCalculator.jsx';
import JewelryTable from './components/JewelryTable/JewelryTable.jsx';
import BlogPostForm from './components/BlogPostForm/BlogPostForm.jsx';
import {UserProvider} from './UserContext.js';
import BlogPostList from './components/BlogPostList/BlogPostList.jsx';
import EditBlogPost from './components/EditBlogPost/EditBlogPost.jsx'
import HomeExpenses from './components/HomeExpenses/HomeExpenses.jsx'

function App() {
  const goldPrice14k = { ils: 160, usd: 45 }; // Example prices
  const goldPrice18k = { ils: 180, usd: 50 }; // Example prices
  const goldPrice24k = { ils: 220, usd: 60 }; // Example prices

  return (
    <UserProvider>
  
    <Router>
    <Header />
      <Routes>
        <Route path="/GoldPrice" element={<GoldPrice />} />
        <Route path="/CreateUser" element={<CreateUser />} />
        <Route 
          path="/JewelryCalculator" 
          element={
            <JewelryCalculator 
              goldPrice14k={goldPrice14k} 
              goldPrice18k={goldPrice18k} 
              goldPrice24k={goldPrice24k} 
            />
          } 
        />
        <Route path="/JewelryTable" element={<JewelryTable />} />
        <Route path="/BlogPostForm" element={<BlogPostForm />} />
        <Route path='/BlogPostList' element={<BlogPostList/>} />
        <Route path='/edit-post/:id' element={<EditBlogPost />} />
        <Route path="/HomeExpenses" element={<HomeExpenses />} />
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
