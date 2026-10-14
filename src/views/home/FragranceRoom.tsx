import Image from "next/image";
import Link from "next/link";
import RevealHeading from "../../motion/RevealHeading";
import { productRepository } from "../../repositories/productRepository";
import type { Product } from "../../types/commerce";
import FragranceRoomScene from "./FragranceRoomScene";

// Three fragrance families, one house each: floral, floral-warm, fresh.
const ROOM = ["chanel-no-5-eau-de-parfum", "ysl-libre-eau-de-parfum", "dior-sauvage-eau-de-parfum"];

const fragrances = ROOM.flatMap((slug) => {
  const product = productRepository.getBySlug(slug);
  return product ? [product] : [];
});

const notesOf = (product: Product) => product.ingredients.split(" · ");

export default function FragranceRoom() {
  return (
    <FragranceRoomScene steps={fragrances.length}>
      <div className="pgRoomPanel">
        <div className="pgRoomStage">
          <header className="pgRoomHead">
            <p className="pgEyebrow">Chapter 02 · The fragrance room</p>
            <RevealHeading
              id="room-title"
              className="pgRoomTitle"
              lines={["Three ways", <em key="em">to be remembered.</em>]}
            />
          </header>

          {fragrances.map((product, index) => (
            <div className="pgRoomStep" data-step={index} key={product.id}>
              <figure className="pgRoomFigure">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    fill
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    quality={90}
                  />
                )}
              </figure>
              <div className="pgRoomCopy">
                <span className="pgRoomIndex">0{index + 1}</span>
                <p className="pgRoomBrand">{product.brand}</p>
                <h3 className="pgRoomName">{product.name}</h3>
                {/* Collapsed for the inactive steps when the chapter is staged. */}
                <div className="pgRoomMore">
                  <div>
                    <ul className="pgRoomNotes" aria-label="Notes">
                      {notesOf(product).map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                    <Link className="pgTextLink pgTextLinkLight" href={`/product/${product.slug}`}>
                      Discover {product.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FragranceRoomScene>
  );
}
