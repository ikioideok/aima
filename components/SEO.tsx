import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image,
    path,
    noindex = false
}) => {
    const siteUrl = 'https://ai-and-marketing.jp';
    const currentUrl = path ? `${siteUrl}${path}` : siteUrl;
    const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/ogp.png`;

    const pageTitle = title ? `${title} | AIMA Inc.` : 'AIMA Inc.｜AIマーケティングとLLM活用コンサルティング';
    const pageDescription = description || 'AIMA Inc.は大阪拠点のAIコンサルティングファーム。AIマーケティング、LLM活用（RAG構築・ナレッジ活用）、データ分析で意思決定を支援します。';
    const pageImage = imageUrl;
    const pageUrl = currentUrl;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />

            {/* OGP */}
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="AIMA Inc." />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />

            {/* Canonical */}
            <link rel="canonical" href={pageUrl} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex,nofollow" />}
        </Helmet>
    );
};
