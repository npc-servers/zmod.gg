#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Get the last commit date for a file
function getLastModified(filePath) {
    try {
        const gitDate = execSync(`git log -1 --format="%ai" -- "${filePath}"`, { encoding: 'utf8' }).trim();
        if (gitDate) {
            return new Date(gitDate).toISOString().split('T')[0];
        }
    } catch (error) {
        console.warn(`Could not get git date for ${filePath}, using current date`);
    }
    return new Date().toISOString().split('T')[0];
}

// Define your site structure
const pages = [
    {
        loc: 'https://zmod.gg/',
        file: 'index.html',
        changefreq: 'weekly',
        priority: '1.0',
        images: [
            {
                loc: 'https://zmod.gg/assets/logos/zmod_logo.svg',
                title: 'ZMod Logo',
                caption: 'ZMod - Game Development Studio'
            }
        ]
    },
    {
        loc: 'https://zmod.gg/servers',
        file: 'servers.html',
        changefreq: 'daily',
        priority: '0.9'
    },
    {
        loc: 'https://zmod.gg/discord',
        file: 'discord.html',
        changefreq: 'monthly',
        priority: '0.8'
    },
    {
        loc: 'https://zmod.gg/tos',
        file: 'tos.html',
        changefreq: 'monthly',
        priority: '0.6'
    },
    {
        loc: 'https://zmod.gg/privacy',
        file: 'privacy.html',
        changefreq: 'monthly',
        priority: '0.6'
    },
    {
        loc: 'https://zmod.gg/legal/guidelines',
        file: 'legal/guidelines.html',
        changefreq: 'monthly',
        priority: '0.6'
    },
    {
        loc: 'https://zmod.gg/store/tos',
        file: 'store/tos.html',
        changefreq: 'monthly',
        priority: '0.5'
    }
];

// Generate sitemap XML
function generateSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    `;

    pages.forEach(page => {
        const lastmod = getLastModified(page.file);
        
        xml += `
    <url>
        <loc>${page.loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>`;

        if (page.images) {
            page.images.forEach(image => {
                xml += `
        <image:image>
            <image:loc>${image.loc}</image:loc>
            <image:title>${image.title}</image:title>
            <image:caption>${image.caption}</image:caption>
        </image:image>`;
            });
        }

        xml += `
    </url>`;
    });

    xml += `
    
</urlset>
`;

    return xml;
}

// Write the sitemap
const sitemapContent = generateSitemap();
fs.writeFileSync('sitemap.xml', sitemapContent);
console.log('✅ Sitemap generated successfully with updated lastmod dates!');
console.log('📅 Pages updated:');
pages.forEach(page => {
    const lastmod = getLastModified(page.file);
    console.log(`   ${page.loc} → ${lastmod}`);
});
