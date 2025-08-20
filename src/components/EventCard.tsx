import BuyButton from "./BuyButton";

type Props = {
  title: string;
  city: string;
  price: string;
  image?: string;
  href?: string;
  priceId?: string;
};

export default function EventCard({ title, city, price, image = "", href = "#", priceId }: Props) {
  return (
    <article className="card overflow-hidden">
      <a href={href} className="block">
        <div className="aspect-[16/9]" style={{
          background:"#000",
          backgroundImage: image ? `url('${image}')` : "none",
          backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat"
        }}/>
      </a>
      <div className="p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-medium leading-tight"><a href={href}>{title}</a></h3>
          <p className="text-xs text-muted">{city}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">desde</p>
          <p className="text-lg font-semibold">{price}</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <BuyButton priceId={priceId} />
      </div>
    </article>
  );
}