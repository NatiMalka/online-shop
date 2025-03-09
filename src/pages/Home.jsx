import React from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories, addToCart } from '../utils/storage'
import { useToast } from '../context/ToastContext'

// Import icons for categories
import { 
  // Food & Beverage icons
  FaUtensils, FaBreadSlice, FaCarrot, FaWineGlass, FaCoffee,
  FaAppleAlt, FaFish, FaIceCream, FaEgg, FaCheese, FaPizzaSlice,
  FaHamburger, FaCandyCane, FaCookie, FaWineBottle, FaGlassMartini,
  FaLemon, FaPepperHot, FaDrumstickBite, FaBacon, FaHotdog, FaMugHot,
  FaGlassWhiskey, FaWater, FaLeaf, FaSeedling, 
  
  // Shopping & Store icons
  FaShoppingBasket, FaStore, FaShoppingCart, FaShoppingBag, FaTag, 
  FaPercent, FaMoneyBillWave, FaCreditCard, FaTruck, FaBox, FaBoxOpen, 
  FaGift, FaStar, FaHeart,
  
  // Hardware & Tools (Tambour)
  FaTools, FaHammer, FaPaintRoller, FaPaintBrush, FaWrench, FaScrewdriver,
  FaRuler, FaRulerCombined, FaHardHat, FaLightbulb, FaPlug, FaBolt,
  FaFaucet, FaToilet, FaShower, FaBath, FaCouch, FaChair, FaBed, FaDoorOpen,
  
  // Games & Toys
  FaDice, FaGamepad, FaChess, FaChessKnight, FaPuzzlePiece, FaFootballBall,
  FaBasketballBall, FaVolleyballBall, FaTableTennis, FaBiking, FaRunning,
  
  // Office & School
  FaPen, FaPencilAlt, FaBook, FaBookOpen, FaGraduationCap, FaClipboard,
  FaCalculator, FaPaperclip, FaStamp, FaPrint,
  
  // Electronics
  FaMobile, FaLaptop, FaDesktop, FaHeadphones, FaCamera, FaVideo,
  FaTv, FaKeyboard, FaMouse, FaMicrophone, FaVolumeUp, FaBatteryFull,
  
  // Clothing & Accessories
  FaTshirt, FaSocks, FaGem, FaGlasses, FaHatWizard, FaMitten, FaUmbrella,
  FaRing,
  
  // Home & Garden
  FaHome, FaTree, FaSprayCan, FaBroom, FaTrash, FaRecycle, FaWind, FaFan,
  FaTemperatureLow, FaTemperatureHigh,
  
  // Beauty & Personal Care
  FaCut, FaHandSparkles, FaHandsWash, FaPumpSoap, 
  FaSpa, FaHospital, FaMedkit, FaPills, FaFirstAid, FaBaby
} from 'react-icons/fa'

function Home() {
  const products = getProducts()
  const categories = getCategories()
  const featuredProducts = products.slice(0, 4)
  const { showToast } = useToast()

  // Map of all available icons
  const iconComponents = {
    // Food & Beverage
    FaUtensils: <FaUtensils className="text-3xl mb-3" />,
    FaBreadSlice: <FaBreadSlice className="text-3xl mb-3" />,
    FaCarrot: <FaCarrot className="text-3xl mb-3" />,
    FaWineGlass: <FaWineGlass className="text-3xl mb-3" />,
    FaCoffee: <FaCoffee className="text-3xl mb-3" />,
    FaAppleAlt: <FaAppleAlt className="text-3xl mb-3" />,
    FaFish: <FaFish className="text-3xl mb-3" />,
    FaIceCream: <FaIceCream className="text-3xl mb-3" />,
    FaEgg: <FaEgg className="text-3xl mb-3" />,
    FaCheese: <FaCheese className="text-3xl mb-3" />,
    FaPizzaSlice: <FaPizzaSlice className="text-3xl mb-3" />,
    FaHamburger: <FaHamburger className="text-3xl mb-3" />,
    FaCandyCane: <FaCandyCane className="text-3xl mb-3" />,
    FaCookie: <FaCookie className="text-3xl mb-3" />,
    FaWineBottle: <FaWineBottle className="text-3xl mb-3" />,
    FaGlassMartini: <FaGlassMartini className="text-3xl mb-3" />,
    FaLemon: <FaLemon className="text-3xl mb-3" />,
    FaPepperHot: <FaPepperHot className="text-3xl mb-3" />,
    FaDrumstickBite: <FaDrumstickBite className="text-3xl mb-3" />,
    FaBacon: <FaBacon className="text-3xl mb-3" />,
    FaHotdog: <FaHotdog className="text-3xl mb-3" />,
    FaMugHot: <FaMugHot className="text-3xl mb-3" />,
    FaGlassWhiskey: <FaGlassWhiskey className="text-3xl mb-3" />,
    FaWater: <FaWater className="text-3xl mb-3" />,
    
    // Hardware & Tools (Tambour)
    FaTools: <FaTools className="text-3xl mb-3" />,
    FaHammer: <FaHammer className="text-3xl mb-3" />,
    FaPaintRoller: <FaPaintRoller className="text-3xl mb-3" />,
    FaPaintBrush: <FaPaintBrush className="text-3xl mb-3" />,
    FaWrench: <FaWrench className="text-3xl mb-3" />,
    FaScrewdriver: <FaScrewdriver className="text-3xl mb-3" />,
    FaRuler: <FaRuler className="text-3xl mb-3" />,
    FaRulerCombined: <FaRulerCombined className="text-3xl mb-3" />,
    FaHardHat: <FaHardHat className="text-3xl mb-3" />,
    FaLightbulb: <FaLightbulb className="text-3xl mb-3" />,
    FaPlug: <FaPlug className="text-3xl mb-3" />,
    FaBolt: <FaBolt className="text-3xl mb-3" />,
    FaFaucet: <FaFaucet className="text-3xl mb-3" />,
    FaToilet: <FaToilet className="text-3xl mb-3" />,
    FaShower: <FaShower className="text-3xl mb-3" />,
    FaBath: <FaBath className="text-3xl mb-3" />,
    
    // Home & Furniture
    FaCouch: <FaCouch className="text-3xl mb-3" />,
    FaChair: <FaChair className="text-3xl mb-3" />,
    FaBed: <FaBed className="text-3xl mb-3" />,
    FaDoorOpen: <FaDoorOpen className="text-3xl mb-3" />,
    FaHome: <FaHome className="text-3xl mb-3" />,
    FaToilet: <FaToilet className="text-3xl mb-3" />,
    FaBath: <FaBath className="text-3xl mb-3" />,
    FaShower: <FaShower className="text-3xl mb-3" />,
    
    // Games & Toys
    FaDice: <FaDice className="text-3xl mb-3" />,
    FaGamepad: <FaGamepad className="text-3xl mb-3" />,
    FaChess: <FaChess className="text-3xl mb-3" />,
    FaChessKnight: <FaChessKnight className="text-3xl mb-3" />,
    FaPuzzlePiece: <FaPuzzlePiece className="text-3xl mb-3" />,
    FaFootballBall: <FaFootballBall className="text-3xl mb-3" />,
    FaBasketballBall: <FaBasketballBall className="text-3xl mb-3" />,
    FaVolleyballBall: <FaVolleyballBall className="text-3xl mb-3" />,
    FaTableTennis: <FaTableTennis className="text-3xl mb-3" />,
    FaBiking: <FaBiking className="text-3xl mb-3" />,
    FaRunning: <FaRunning className="text-3xl mb-3" />,
    
    // Office & School
    FaPen: <FaPen className="text-3xl mb-3" />,
    FaPencilAlt: <FaPencilAlt className="text-3xl mb-3" />,
    FaBook: <FaBook className="text-3xl mb-3" />,
    FaBookOpen: <FaBookOpen className="text-3xl mb-3" />,
    FaGraduationCap: <FaGraduationCap className="text-3xl mb-3" />,
    FaClipboard: <FaClipboard className="text-3xl mb-3" />,
    FaCalculator: <FaCalculator className="text-3xl mb-3" />,
    FaPaperclip: <FaPaperclip className="text-3xl mb-3" />,
    FaStamp: <FaStamp className="text-3xl mb-3" />,
    FaPrint: <FaPrint className="text-3xl mb-3" />,
    
    // Electronics
    FaMobile: <FaMobile className="text-3xl mb-3" />,
    FaLaptop: <FaLaptop className="text-3xl mb-3" />,
    FaDesktop: <FaDesktop className="text-3xl mb-3" />,
    FaHeadphones: <FaHeadphones className="text-3xl mb-3" />,
    FaCamera: <FaCamera className="text-3xl mb-3" />,
    FaVideo: <FaVideo className="text-3xl mb-3" />,
    FaTv: <FaTv className="text-3xl mb-3" />,
    FaKeyboard: <FaKeyboard className="text-3xl mb-3" />,
    FaMouse: <FaMouse className="text-3xl mb-3" />,
    FaMicrophone: <FaMicrophone className="text-3xl mb-3" />,
    FaVolumeUp: <FaVolumeUp className="text-3xl mb-3" />,
    FaBatteryFull: <FaBatteryFull className="text-3xl mb-3" />,
    
    // Clothing & Accessories
    FaTshirt: <FaTshirt className="text-3xl mb-3" />,
    FaSocks: <FaSocks className="text-3xl mb-3" />,
    FaGem: <FaGem className="text-3xl mb-3" />,
    FaGlasses: <FaGlasses className="text-3xl mb-3" />,
    FaHatWizard: <FaHatWizard className="text-3xl mb-3" />,
    FaMitten: <FaMitten className="text-3xl mb-3" />,
    FaUmbrella: <FaUmbrella className="text-3xl mb-3" />,
    FaRing: <FaRing className="text-3xl mb-3" />,
    
    // Beauty & Personal Care
    FaCut: <FaCut className="text-3xl mb-3" />,
    FaSprayCan: <FaSprayCan className="text-3xl mb-3" />,
    FaHandSparkles: <FaHandSparkles className="text-3xl mb-3" />,
    FaHandsWash: <FaHandsWash className="text-3xl mb-3" />,
    FaPumpSoap: <FaPumpSoap className="text-3xl mb-3" />,
    FaSpa: <FaSpa className="text-3xl mb-3" />,
    
    // Health & Medicine
    FaHospital: <FaHospital className="text-3xl mb-3" />,
    FaMedkit: <FaMedkit className="text-3xl mb-3" />,
    FaPills: <FaPills className="text-3xl mb-3" />,
    FaFirstAid: <FaFirstAid className="text-3xl mb-3" />,
    FaBaby: <FaBaby className="text-3xl mb-3" />,
    
    // Garden & Outdoor
    FaHome: <FaHome className="text-3xl mb-3" />,
    FaTree: <FaTree className="text-3xl mb-3" />,
    FaLeaf: <FaLeaf className="text-3xl mb-3" />,
    FaSeedling: <FaSeedling className="text-3xl mb-3" />,
    FaSprayCan: <FaSprayCan className="text-3xl mb-3" />,
    FaBroom: <FaBroom className="text-3xl mb-3" />,
    FaTrash: <FaTrash className="text-3xl mb-3" />,
    FaRecycle: <FaRecycle className="text-3xl mb-3" />,
    FaWind: <FaWind className="text-3xl mb-3" />,
    FaFan: <FaFan className="text-3xl mb-3" />,
    FaTemperatureLow: <FaTemperatureLow className="text-3xl mb-3" />,
    FaTemperatureHigh: <FaTemperatureHigh className="text-3xl mb-3" />,
    
    // Shopping & Store
    FaShoppingBasket: <FaShoppingBasket className="text-3xl mb-3" />,
    FaStore: <FaStore className="text-3xl mb-3" />,
    FaShoppingCart: <FaShoppingCart className="text-3xl mb-3" />,
    FaShoppingBag: <FaShoppingBag className="text-3xl mb-3" />,
    FaTag: <FaTag className="text-3xl mb-3" />,
    FaPercent: <FaPercent className="text-3xl mb-3" />,
    FaMoneyBillWave: <FaMoneyBillWave className="text-3xl mb-3" />,
    FaCreditCard: <FaCreditCard className="text-3xl mb-3" />,
    FaTruck: <FaTruck className="text-3xl mb-3" />,
    FaBox: <FaBox className="text-3xl mb-3" />,
    FaBoxOpen: <FaBoxOpen className="text-3xl mb-3" />,
    FaGift: <FaGift className="text-3xl mb-3" />,
    FaStar: <FaStar className="text-3xl mb-3" />,
    FaHeart: <FaHeart className="text-3xl mb-3" />
  }

  // Get appropriate icon or default
  const getCategoryIcon = (category) => {
    // If showIcon is explicitly set to false, return null
    if (category.showIcon === false) {
      return null;
    }
    
    // If category has an iconName property, use it
    if (category.iconName && iconComponents[category.iconName]) {
      return iconComponents[category.iconName]
    }
    // Otherwise use default icon
    return iconComponents.FaUtensils
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    showToast(`${product.name} נוסף לסל הקניות`, 'success')
  }

  return (
    <div className="space-y-12">
      {/* Hero Section - Enhanced */}
      <section className="relative py-20 rounded-2xl overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ברוכים הבאים לחנות האונליין שלנו
          </h1>
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
            מצאו את המוצרים הטובים ביותר במחירים הטובים ביותר
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              צפה במוצרים
            </Link>
            <Link to="/products?category=1" className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium text-lg">
              קטגוריות פופולריות
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">קטגוריות</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">מצאו את המוצרים הטובים ביותר במחירים הטובים ביותר</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-blue-400 to-purple-500 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              <div className="relative p-6 text-center">
                {getCategoryIcon(category) && (
                  <div className="flex justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    {getCategoryIcon(category)}
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{category.description}</p>
                <span className="inline-block text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                  צפה במוצרים
                  <span className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-200">←</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">מוצרים מומלצים</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">המוצרים הפופולריים ביותר בחנות שלנו</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-blue-600 font-bold">
                  ₪{product.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                    </svg>
                    הוסף לסל
                  </button>
                  <Link
                    to={`/products?category=${product.categoryId}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    צפה בפרטים
                    <span className="inline-block ml-1">←</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/products" className="inline-flex items-center bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            צפה בכל המוצרים
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 