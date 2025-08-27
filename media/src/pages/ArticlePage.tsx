import React from 'react';
import { useParams } from 'react-router-dom';
import featuredArticle from '../data/featuredArticle.json';
import specialArticles from '../data/specialArticles.json';
import recentArticles from '../data/recentArticles.json';
import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';

// Combine all articles into one array. Note: featuredArticle is an object, not an array.
const allArticles = [featuredArticle, ...specialArticles, ...recentArticles];

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = allArticles.find(a => a.slug === slug);

  const generateStructuredData = () => {
    if (!article) return null;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'image': [article.imageUrl],
      'datePublished': new Date(article.publishDate).toISOString(),
      'author': [{
        '@type': 'Person',
        'name': article.author
      }],
      'description': article.excerpt,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  };

  const pageContent = article ? (
    <article className="space-y-4">
      <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-8" />
      <h1 className="text-4xl font-bold text-foreground">{article.title}</h1>
      <div className="text-muted-foreground">
        <span>By {article.author}</span> | <span>{article.publishDate}</span> | <span>{article.readTime} read</span>
      </div>
      <div className="border-b my-4"></div>
      <p className="text-lg text-foreground leading-relaxed">{article.excerpt}</p>
      {/* If there were a 'body' field, it would be rendered here */}
    </article>
  ) : (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold">404 - Article Not Found</h1>
      <p className="text-muted-foreground">Sorry, the article you are looking for does not exist.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {generateStructuredData()}
      <SimpleHeader />
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        {pageContent}
      </main>
      <SimpleFooter />
    </div>
  );
};

export default ArticlePage;
