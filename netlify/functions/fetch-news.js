import fetch from "node-fetch";
import Parser from "rss-parser";

const parser = new Parser();

export async function handler(event, context) {
    const feeds = [
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://www.nasa.gov/rss/dyn/breaking_news.rss",
        "https://www.abc.es/rss/feeds/abc_ultima.xml",
        "https://www.eluniversal.com.mx/rss/mxm.xml",
        "https://cnnespanol.cnn.com/feed/"
    ];

    let allNews = [];

    try {
        for (const url of feeds) {
            const feed = await parser.parseURL(url);

            const formatted = feed.items.slice(0, 10).map(item => ({
                title: item.title,
                link: item.link,
                desc: item.contentSnippet || "",
                img: extractImage(item)
            }));

            allNews.push(...formatted);
        }

        allNews = allNews.sort(() => Math.random() - 0.5).slice(0, 3);

        return {
            statusCode: 200,
            body: JSON.stringify(allNews)
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
}

function extractImage(item) {
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    if (item.content) {
        const match = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (match) return match[1];
    }
    return "https://via.placeholder.com/400x250?text=Noticia";
}
