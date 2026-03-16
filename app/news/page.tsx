import { getNews } from "@/app/actions/news";
import NewsPageClient from "./NewsPageClient";

export const metadata = {
  title: "ALL UPDATES & OPERATIONS | MIENO CORP.",
  description: "MIENO CORP. 最新通達および作戦行動記録",
};

export default async function NewsPage() {
  const news = await getNews();

  return <NewsPageClient initialNews={news} />;
}
