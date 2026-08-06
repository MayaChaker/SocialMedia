import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowForward, Check, LockOutlined, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { PRODUCTS, money } from "../data/products";
import { BESTSELLER_IDS, CONCERNS, CUSTOMER_REVIEWS, HOME_CATEGORIES, SOCIAL_TILES } from "../data/merchandising";
import ProductCard from "../features/products/ProductCard";
import ProductVisual from "../features/products/ProductVisual";
import { useStore } from "../hooks/useStore";

const trustPoints = ["Skin-respecting formulas", "Thoughtfully selected actives", "Cruelty-free", "Complimentary delivery over $75"];
const formulaPrinciples = [
  { number: "01", title: "Proven actives", copy: "Purposeful levels of ingredients selected for visible, consistent results." },
  { number: "02", title: "Barrier first", copy: "Every texture is designed to support comfort, resilience, and daily use." },
  { number: "03", title: "Nothing performative", copy: "No unnecessary complexity—only formulas that earn their place in your ritual." },
];

export default function HomePage({ openCart }) {
  const { addToCart } = useStore();
  const bestsellers = BESTSELLER_IDS.map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);
  const routine = [2, 1, 5].map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);
  const routineTotal = routine.reduce((sum, product) => sum + product.price, 0);
  const addRoutine = () => { routine.forEach(product => addToCart(product)); openCart(); };

  return <main className="homePage">
    <section className="hero homeHero">
      <motion.div className="heroCopy" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
        <span className="kicker">Beauty, considered.</span>
        <h1>Quiet luxury<br/>for your skin.</h1>
        <p>High-performance essentials created to make your daily ritual feel instinctive, sensorial, and entirely your own.</p>
        <div className="heroActions"><Link className="button dark" to="/shop">Shop the collection <ArrowForward/></Link><Link className="textLink" to="/shop?collection=bestsellers">Shop bestsellers</Link></div>
        <p className="heroReassurance"><LockOutlined/> Complimentary delivery over $75 · Easy returns · Secure checkout</p>
      </motion.div>
        <div className="heroImage"><img src="/veloura-hero.webp" alt="Veloura rose-gold serum, cream and lipstick arranged in warm editorial light" width="1536" height="1024" fetchpriority="high"/><div className="heroNote"><span>THE VELOURA EDIT</span><strong>Three icons. One effortless ritual.</strong></div></div>
    </section>

    <section className="trustBar" aria-label="Why shop Veloura">{trustPoints.map(point=><div key={point}><Check/><span>{point}</span></div>)}</section>

    <section className="homeSection bestsellersSection">
      <SectionHeading eyebrow="Customer favourites" title="Bestsellers" copy="Made to be reached for, repurchased, and kept close." href="/shop?collection=bestsellers" link="Shop all bestsellers"/>
      <div className="productGrid homeGrid">{bestsellers.map(product=><ProductCard key={product.id} product={product} onAdded={openCart}/>)}</div>
    </section>

    <section className="homeSection categorySection">
      <SectionHeading eyebrow="Find your ritual" title="Shop by category" copy="A concise wardrobe of skincare, colour, and considered sets."/>
      <div className="categoryGrid">{HOME_CATEGORIES.map(category=><Link className={`categoryCard ${category.tone}`} to={category.href} key={category.title}><img src={category.image} alt="" loading="lazy" width="1000" height="1000"/><span><small>{category.copy}</small><strong>{category.title}</strong><em>Shop now <ArrowForward/></em></span></Link>)}</div>
    </section>

    <section className="concernSection">
      <div><span className="kicker">Personal to your skin</span><h2>Shop by concern.</h2><p>Start with what your skin is asking for today.</p></div>
      <nav aria-label="Shop by skin concern">{CONCERNS.map(concern=><Link to={concern.href} key={concern.title}><span>{concern.title}</span><small>{concern.copy}</small><ArrowForward/></Link>)}</nav>
    </section>

    <section className="routineCommerce">
      <div className="routineImage"><img src="/lifestyle/veloura-evening-vanity.webp" alt="Veloura evening cleanser and moisturizer arranged on a warm stone vanity" loading="lazy" width="1254" height="1254"/></div>
      <div className="routineCopy"><span className="kicker">The evening edit</span><h2>Three steps.<br/>A softer morning.</h2><p>A complete replenishing routine, layered from lightest to richest to support skin through the night.</p><ol>{routine.map((product,index)=><li key={product.id}><span>0{index+1}</span><div><small>{["Cleanse","Treat","Moisturize"][index]}</small><Link to={`/product/${product.slug}`}>{product.name}</Link></div><b>{money(product.price)}</b></li>)}</ol><div className="routineTotal"><span>Complete routine</span><strong>{money(routineTotal)}</strong></div><div className="routineActions"><button className="button light" onClick={addRoutine}>Add the full routine</button><Link className="textLink" to="/rituals">Build your own</Link></div></div>
    </section>

    <section className="formulaSection">
      <div className="formulaIntro"><span className="kicker">Our formulation standard</span><h2>Intentional formulas.<br/><em>Nothing extra.</em></h2><p>Proven actives, sensorial textures, and skin-supporting essentials—balanced for rituals you will want to keep.</p><Link className="textLink" to="/about">Explore our formulas <ArrowForward/></Link></div>
      <div className="formulaPoints">{formulaPrinciples.map(point=><article key={point.number}><span>{point.number}</span><h3>{point.title}</h3><p>{point.copy}</p></article>)}</div>
    </section>

    <section className="homeSection reviewsSection">
      <SectionHeading eyebrow="Verified by our community" title="Real rituals. Real results." copy="Considered essentials, lived in every day."/>
      <div className="reviewGrid">{CUSTOMER_REVIEWS.map(review=><ReviewCard key={review.name} review={review}/>)}</div>
    </section>

    <section className="socialSection">
      <div className="socialHeading"><div><span className="kicker">@VelouraBeauty</span><h2>In real rituals.</h2></div><a className="textLink" href="https://www.instagram.com/" target="_blank" rel="noreferrer">Follow @VelouraBeauty <ArrowForward/></a></div>
      <div className="socialGrid">{SOCIAL_TILES.map(tile=><img key={tile.src} src={tile.src} alt={tile.alt} loading="lazy" width="1254" height="1254"/>)}</div>
    </section>

    <Newsletter/>
  </main>;
}

function SectionHeading({ eyebrow, title, copy, href, link }) { return <div className="homeSectionHeader"><div><span className="kicker">{eyebrow}</span><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{href&&<Link className="textLink" to={href}>{link}<ArrowForward/></Link>}</div> }

function ReviewCard({ review }) { return <article className="customerReview"><div className="reviewStars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({length:review.rating}).map((_,index)=><Star key={index}/>)}</div><blockquote>“{review.text}”</blockquote><div><strong>{review.product}</strong><span>{review.name} · Verified buyer</span></div></article> }

function Newsletter(){
  const [email,setEmail]=useState("");
  const [status,setStatus]=useState("idle");
  const [message,setMessage]=useState("");
  const submit=async(event)=>{event.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setStatus("error");setMessage("Enter a valid email address.");return}setStatus("loading");setMessage("");try{const endpoint=process.env.REACT_APP_NEWSLETTER_URL;if(endpoint){const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});if(!response.ok)throw new Error()}else await new Promise(resolve=>setTimeout(resolve,650));setStatus("success");setMessage("Welcome to the Veloura letter.");setEmail("")}catch{setStatus("error");setMessage("We couldn’t subscribe you just now. Please try again.")}};
  return <section className="newsletter homeNewsletter"><span className="kicker">The Veloura letter</span><h2>First access, privately shared.</h2><p>Early access to launches, private offers, and considered beauty advice—sent occasionally.</p><form onSubmit={submit} noValidate><label className="srOnly" htmlFor="newsletterEmail">Email address</label><input id="newsletterEmail" type="email" value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="Email address" aria-describedby="newsletterStatus" disabled={status==="loading"}/><button aria-label="Join newsletter" disabled={status==="loading"}>{status==="loading"?"Joining…":<ArrowForward/>}</button></form><span id="newsletterStatus" className={`newsletterStatus ${status}`} role="status">{message}</span></section>
}
