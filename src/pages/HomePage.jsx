import { Link } from "react-router-dom";
import { ArrowForward, Check, LockOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { PRODUCTS, money } from "../data/products";
import { BESTSELLER_IDS, HOME_CATEGORIES } from "../data/merchandising";
import ProductCard from "../features/products/ProductCard";
import { useStore } from "../hooks/useStore";

const trustPoints = ["Skin-respecting formulas", "Cruelty-free", "Secure checkout", "Complimentary delivery over $75"];

export default function HomePage({ openCart }) {
  const { addToCart } = useStore();
  const bestsellers = BESTSELLER_IDS.map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean).map(product => product.id === 1 ? { ...product, image: "/products/veloura-serum-bestseller-v2.webp" } : product);
  const routine = [2, 1, 5].map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);
  const routineTotal = routine.reduce((sum, product) => sum + product.price, 0);
  const addRoutine = () => { routine.forEach(product => addToCart(product)); openCart(); };

  return <main className="homePage">
    <section className="hero homeHero">
      <motion.div className="heroCopy" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35}}>
        <span className="kicker">Beauty, considered.</span>
        <h1>Quiet luxury<br/>for your skin.</h1>
        <p>High-performance essentials created to make your daily ritual feel instinctive, sensorial, and entirely your own.</p>
        <div className="heroActions"><Link className="button dark" to="/shop">Shop the collection <ArrowForward/></Link><Link className="textLink" to="/shop?collection=bestsellers">Shop bestsellers</Link></div>
        <p className="heroReassurance"><LockOutlined/> Complimentary delivery over $75 · Easy returns · Secure checkout</p>
      </motion.div>
      <div className="heroImage"><img src="/lifestyle/veloura-hero-campaign-burgundy.png" alt="Rose-gold Veloura serum, cream jar and burgundy lipstick photographed on warm travertine" width="1536" height="1024" fetchpriority="high"/></div>
    </section>

    <section className="trustBar" aria-label="Why shop Veloura">{trustPoints.map(point=><div key={point}><Check/><span>{point}</span></div>)}</section>

    <section className="homeSection bestsellersSection">
      <SectionHeading title="Bestsellers" copy="Made to be reached for." href="/shop?collection=bestsellers" link="Shop all bestsellers"/>
      <div className="productGrid homeGrid">{bestsellers.map(product=><ProductCard key={product.id} product={product} onAdded={openCart}/>)}</div>
    </section>

    <section className="homeSection categorySection">
      <SectionHeading eyebrow="Find your ritual" title="Shop by category" copy="Skincare, colour, and considered sets—designed to live together."/>
      <div className="categoryGrid">{HOME_CATEGORIES.map(category=><Link className="categoryCard" to={category.href} key={category.title}><img src={category.image} alt="" loading="lazy" width="1000" height="1250"/><span><small>{category.copy}</small><strong>{category.title}</strong><em>Shop now <ArrowForward/></em></span></Link>)}</div>
    </section>

    <section className="routineCommerce">
      <div className="routineImage"><img src="/lifestyle/veloura-evening-edit-v2.webp" alt="Three burgundy Veloura evening skincare products arranged with a cream towel and rose-gold mirror" loading="lazy" width="1535" height="1024"/></div>
      <div className="routineCopy"><div className="routineContent"><span className="kicker">The evening edit</span><h2>Three steps.<br/>A softer night.</h2><p>A complete replenishing routine, layered from lightest to richest to support skin through the night.</p><ol>{routine.map((product,index)=><li key={product.id}><span>0{index+1}</span><div><small>{["Cleanse","Treat","Moisturize"][index]}</small><Link to={`/product/${product.slug}`}>{product.name}</Link></div><b>{money(product.price)}</b></li>)}</ol><div className="routineTotal"><span>Complete routine</span><strong>{money(routineTotal)}</strong></div><div className="routineActions"><button className="button light" onClick={addRoutine}>Add the full routine</button><Link className="textLink" to="/rituals">Build your own</Link></div></div></div>
    </section>

  </main>;
}

function SectionHeading({ eyebrow, title, copy, href, link, external }) { return <div className="homeSectionHeader"><div>{eyebrow&&<span className="kicker">{eyebrow}</span>}<h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{href&&(external?<a className="textLink" href={href} target="_blank" rel="noreferrer">{link}<ArrowForward/></a>:<Link className="textLink" to={href}>{link}<ArrowForward/></Link>)}</div> }
