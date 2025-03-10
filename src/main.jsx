import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { getProducts, setProducts, getCategories, setCategories } from './utils/storage'
import { getProductsOnce, getCategoriesOnce, saveProducts, saveCategories } from './utils/firebase'
import emailjs from '@emailjs/browser'

// Initialize EmailJS
emailjs.init('wdkhxkDvY1CBqWjhm')

// Initialize sample data if not exists
const initSampleData = async () => {
  try {
    // First try to get data from Firebase
    let firebaseProducts = await getProductsOnce();
    let firebaseCategories = await getCategoriesOnce();
    
    // Check if categories exist in Firebase
    if (firebaseCategories && firebaseCategories.length > 0) {
      // Use Firebase data and sync to localStorage
      setCategories(firebaseCategories);
      console.log('Categories loaded from Firebase');
    } else {
      // Check if categories exist in localStorage
      const localCategories = getCategories();
      if (localCategories.length === 0) {
        // Create sample categories if neither Firebase nor localStorage has data
        const sampleCategories = [
          {
            id: '1',
            name: 'פירות וירקות',
            description: 'פירות וירקות טריים'
          },
          {
            id: '2',
            name: 'מוצרי חלב',
            description: 'חלב, גבינות ומוצרי חלב'
          },
          {
            id: '3',
            name: 'לחם ומאפים',
            description: 'לחם טרי ומאפים'
          },
          {
            id: '4',
            name: 'משקאות',
            description: 'מים, מיצים ומשקאות קלים'
          }
        ];
        setCategories(sampleCategories);
        // Also save to Firebase
        await saveCategories(sampleCategories);
        console.log('Sample categories created and saved to Firebase');
      } else {
        // If localStorage has data but Firebase doesn't, sync to Firebase
        await saveCategories(localCategories);
        console.log('Categories from localStorage synced to Firebase');
      }
    }

    // Check if products exist in Firebase
    if (firebaseProducts && firebaseProducts.length > 0) {
      // Use Firebase data and sync to localStorage
      setProducts(firebaseProducts);
      console.log('Products loaded from Firebase');
    } else {
      // Check if products exist in localStorage
      const localProducts = getProducts();
      if (localProducts.length === 0) {
        // Create sample products if neither Firebase nor localStorage has data
        const sampleProducts = [
          {
            id: '1',
            name: 'תפוחים',
            description: 'תפוחים טריים מהמטע',
            price: 5.90,
            image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '1'
          },
          {
            id: '2',
            name: 'בננות',
            description: 'בננות טריות',
            price: 4.90,
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '1'
          },
          {
            id: '3',
            name: 'חלב טרי',
            description: 'חלב טרי 3% שומן',
            price: 6.50,
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '2'
          },
          {
            id: '4',
            name: 'גבינה צהובה',
            description: 'גבינה צהובה 28% שומן',
            price: 12.90,
            image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '2'
          },
          {
            id: '5',
            name: 'לחם אחיד',
            description: 'לחם אחיד פרוס',
            price: 7.90,
            image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '3'
          },
          {
            id: '6',
            name: 'לחמניות',
            description: 'לחמניות טריות',
            price: 9.90,
            image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '3'
          },
          {
            id: '7',
            name: 'מים מינרלים',
            description: 'מים מינרלים טבעיים',
            price: 8.90,
            image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '4'
          },
          {
            id: '8',
            name: 'מיץ תפוזים',
            description: 'מיץ תפוזים טבעי',
            price: 10.90,
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            categoryId: '4'
          }
        ];
        setProducts(sampleProducts);
        // Also save to Firebase
        await saveProducts(sampleProducts);
        console.log('Sample products created and saved to Firebase');
      } else {
        // If localStorage has data but Firebase doesn't, sync to Firebase
        await saveProducts(localProducts);
        console.log('Products from localStorage synced to Firebase');
      }
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    // Fallback to localStorage if Firebase fails
    if (getCategories().length === 0) {
      // Initialize with sample categories
      const sampleCategories = [
        {
          id: '1',
          name: 'פירות וירקות',
          description: 'פירות וירקות טריים'
        },
        {
          id: '2',
          name: 'מוצרי חלב',
          description: 'חלב, גבינות ומוצרי חלב'
        },
        {
          id: '3',
          name: 'לחם ומאפים',
          description: 'לחם טרי ומאפים'
        },
        {
          id: '4',
          name: 'משקאות',
          description: 'מים, מיצים ומשקאות קלים'
        }
      ];
      setCategories(sampleCategories);
    }
    
    if (getProducts().length === 0) {
      // Initialize with sample products
      const sampleProducts = [
        {
          id: '1',
          name: 'תפוחים',
          description: 'תפוחים טריים מהמטע',
          price: 5.90,
          image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '1'
        },
        {
          id: '2',
          name: 'בננות',
          description: 'בננות טריות',
          price: 4.90,
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '1'
        },
        {
          id: '3',
          name: 'חלב טרי',
          description: 'חלב טרי 3% שומן',
          price: 6.50,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '2'
        },
        {
          id: '4',
          name: 'גבינה צהובה',
          description: 'גבינה צהובה 28% שומן',
          price: 12.90,
          image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '2'
        },
        {
          id: '5',
          name: 'לחם אחיד',
          description: 'לחם אחיד פרוס',
          price: 7.90,
          image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '3'
        },
        {
          id: '6',
          name: 'לחמניות',
          description: 'לחמניות טריות',
          price: 9.90,
          image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '3'
        },
        {
          id: '7',
          name: 'מים מינרלים',
          description: 'מים מינרלים טבעיים',
          price: 8.90,
          image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '4'
        },
        {
          id: '8',
          name: 'מיץ תפוזים',
          description: 'מיץ תפוזים טבעי',
          price: 10.90,
          image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          categoryId: '4'
        }
      ];
      setProducts(sampleProducts);
    }
  }
};

// Initialize sample data
initSampleData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
) 