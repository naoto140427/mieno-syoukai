import { getNews } from "@/app/actions/news";
import NewsPageClient from "./NewsPageClient";

export const metadata = {
  title: "最新通達および作戦記録 | MIENO CORP.",
  description: "MIENO CORP. 最新通達および作戦行動記録",
};

export default async function NewsPage() {
  const news = await getNews();

  return <NewsPageClient initialNews={news} />;
}
