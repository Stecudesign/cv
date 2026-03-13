const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const scriptPath = path.join(projectRoot, 'script.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const script = fs.readFileSync(scriptPath, 'utf8');

const failures = [];
const classAttributeMatches = [...html.matchAll(/class="([^"]*)"/gi)];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countMatches = (source, pattern) => {
    const matches = source.match(pattern);
    return matches ? matches.length : 0;
};

const hasClass = (className) => classAttributeMatches.some((match) => match[1].split(/\s+/).includes(className));
const hasId = (id) => new RegExp(`id=["']${escapeRegExp(id)}["']`, 'i').test(html);
const hasAttribute = (attribute) => new RegExp(`\\s${escapeRegExp(attribute)}(?:[\\s=>])`, 'i').test(html);
const countClassOccurrences = (className) => classAttributeMatches.filter((match) => match[1].split(/\s+/).includes(className)).length;

const assert = (condition, message) => {
    if (!condition) {
        failures.push(message);
    }
};

const navHrefMatches = [...html.matchAll(/<a[^>]+href="#([^"]+)"[^>]*>/gi)];
const accordionItems = [...html.matchAll(/<[^>]+class="[^"]*\bexp-accordion-item\b[^"]*"[^>]*data-source-index="([^"]+)"[^>]*>/gi)];
const accordionTriggers = [...html.matchAll(/<[^>]+class="[^"]*\bexp-accordion-trigger\b[^"]*"[^>]*aria-controls="([^"]+)"[^>]*>/gi)];

assert(hasClass('burger-menu') === script.includes("document.querySelector('.burger-menu')"), 'Burger menu selector in JS should match the HTML structure.');
assert(hasClass('main-nav') === script.includes("document.querySelector('.main-nav')"), 'Main nav selector in JS should match the HTML structure.');

navHrefMatches.forEach((match) => {
    const targetId = match[1];
    assert(hasId(targetId), `Navigation link points to missing section id: #${targetId}.`);
});

if (hasAttribute('data-video-open')) {
    assert(hasId('project-video-modal'), 'Video trigger exists but #project-video-modal is missing.');
    assert(hasId('project-video-player'), 'Video trigger exists but #project-video-player is missing.');
    assert(hasAttribute('data-video-close'), 'Video trigger exists but [data-video-close] is missing.');
}

if (hasAttribute('data-certificate-open')) {
    assert(hasId('certificate-modal'), 'Certificate trigger exists but #certificate-modal is missing.');
    assert(hasId('certificate-modal-image'), 'Certificate trigger exists but #certificate-modal-image is missing.');
    assert(hasAttribute('data-certificate-close'), 'Certificate trigger exists but [data-certificate-close] is missing.');
}

const experienceMetaCount = countClassOccurrences('exp-feature-meta');
const experienceCardCount = countClassOccurrences('exp-feature');
assert(experienceMetaCount === experienceCardCount, `Expected the same number of .exp-feature-meta and .exp-feature items, got ${experienceMetaCount} and ${experienceCardCount}.`);

accordionItems.forEach((match) => {
    const sourceIndex = Number(match[1]);
    assert(Number.isInteger(sourceIndex) && sourceIndex >= 0, `Accordion item has invalid data-source-index: ${match[1]}.`);
    assert(sourceIndex < experienceCardCount, `Accordion item points past available experience cards: ${sourceIndex}.`);
});

accordionTriggers.forEach((match) => {
    const panelId = match[1];
    assert(hasId(panelId), `Accordion trigger points to missing panel id: #${panelId}.`);
});

if (!script.includes('buildInlineExperienceHeaders();')) {
    failures.push('Inline experience header builder is defined but not executed.');
}

if (failures.length) {
    console.error('Smoke test failed:\n');
    failures.forEach((failure, index) => {
        console.error(`${index + 1}. ${failure}`);
    });
    process.exit(1);
}

console.log('Smoke test passed.');
