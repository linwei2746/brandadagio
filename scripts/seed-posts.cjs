const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URI || 'postgres://neondb_owner:npg_aMdv14YKAzEk@ep-divine-base-a53gc2vt-pooler.us-east-2.aws.neon.tech/brandadagio?sslmode=require';

function makeLexical(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            mode: 'normal',
            text,
            type: 'text',
            style: '',
            detail: 0,
            format: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
      })),
      direction: 'ltr',
    },
  };
}

const articles = [
  {
    title: 'なぜ専門鑑定が重要なのか？累計200万点の鑑定実績が意味すること',
    slug: 'why-expert-appraisal-matters',
    excerpt: '豊富な実物経験が取引リスクの軽減や正確な判断にどうつながるのか。累計200万件の鑑定実績が意味する専門性について解説します。',
    date: '2026-08-12T00:00:00.000Z',
    image: '/img/1788083506887.png',
    filename: '1788083506887.png',
    paragraphs: [
      'エルメスをはじめとするハイブランドのリセール市場において、真贋の鑑定力はブランドの信頼そのものを左右します。累計200万点を超える鑑定実績は、単なる数字ではなく、あらゆる年代・刻印・レザーの経年変化を直接手に取って検証してきた膨大なデータとノウハウの結晶です。',
      '近年、精巧なスーパーコピーやフェイク品が急増しており、外見だけでは真贋の判別が困難なケースが増えています。ブランドアダージョでは、専門鑑定士がステッチのピッチ、コバの仕上げ、金具の刻印、革の匂いや重量感に至るまで、多角的な基準で厳格に審査を行っています。',
      'すべてのお客様に安心してお買い物・ご売却を楽しんでいただけるよう、最高峰の鑑定基準を維持し続けています。',
    ],
  },
  {
    title: '本物のエルメスを見分けるには？専門鑑定のチェックポイント',
    slug: 'how-to-authenticate-hermes',
    excerpt: 'バッグのフォルム、金具、刻印、レザー、内部構造など、専門鑑定でどこを確認するのかを詳しく解説します。',
    date: '2026-07-28T00:00:00.000Z',
    image: '/img/1788083502310.png',
    filename: '1788083502310.png',
    paragraphs: [
      'エルメスのバッグ（バーキン、ケリー、コンスタンスなど）は、熟練の職人（アルチザン）によって一つひとつ手作業で仕立てられます。そのため、偽物と本物の間には、細部に明確な差異が存在します。',
      'まず第一のポイントは「サドルステッチ（クドゥ・セリエ）」です。エルメスの手縫いステッチは、右上がりの独特の傾斜を持って均一に並びます。ミシン縫いの偽物は平行であったり、糸の締め付け具合にばらつきが生じます。第二に「刻印」の深さと文字の配置、第三に「金具の重みと回転の滑らかさ」です。',
      '私たちの鑑定ブースでは、拡大鏡や特殊ライトを用い、細部に宿る職人の魂と真贋のサインを正確に見極めています。',
    ],
  },
  {
    title: 'Luxury Beyond Ownership — 所有を超えたラグジュアリーの価値',
    slug: 'luxury-beyond-ownership',
    excerpt: 'ラグジュアリーの価値は、所有することだけでは完結しない。私たちが掲げるひとつの理念についてご紹介します。',
    date: '2026-07-05T00:00:00.000Z',
    image: '/img/1788083497989.png',
    filename: '1788083497989.png',
    paragraphs: [
      'ラグジュアリーを「手に入れること」だけが最終目的でしょうか。私たちは、タイムレスな名品を受け継ぎ、新たなオーナーへと繋げていく循環の中にこそ、真の豊かさがあると考えています。',
      'エルメスのバッグは大切に使われれば、数十年、あるいは世代を超えて輝きを保ち続けます。それは単なる消費ではなく、文化的な価値の継承であり、サステナブルなラグジュアリーのあり方です。',
      'brandadagio（ブランドアダージョ）は、厳選された名品とともに、お一人おひとりのストーリーを紡ぐお手伝いをさせていただきます。',
    ],
  },
];

async function run() {
  const pool = new Pool({ connectionString });

  try {
    const existing = await pool.query('SELECT count(*) FROM posts;');
    const count = parseInt(existing.rows[0].count, 10);
    console.log(`Current posts count in database: ${count}`);

    if (count > 0) {
      console.log('Posts table already has documents. Skipping seed.');
      return;
    }

    console.log('Seeding demo blog posts...');
    for (const art of articles) {
      // 1. Insert media
      const mediaRes = await pool.query(
        `INSERT INTO media (alt, filename, url, mime_type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id;`,
        [art.title, art.filename, art.image, 'image/png']
      );
      const mediaId = mediaRes.rows[0].id;
      console.log(`Inserted media id: ${mediaId} for ${art.title}`);

      // 2. Insert post
      const content = makeLexical(art.paragraphs);
      const postRes = await pool.query(
        `INSERT INTO posts (title, slug, excerpt, cover_image_id, content, status, published_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id, title;`,
        [
          art.title,
          art.slug,
          art.excerpt,
          mediaId,
          JSON.stringify(content),
          'published',
          art.date,
        ]
      );
      console.log(`Inserted post id: ${postRes.rows[0].id} - ${postRes.rows[0].title}`);
    }

    const finalCount = await pool.query('SELECT count(*) FROM posts;');
    console.log(`Successfully seeded! Total posts: ${finalCount.rows[0].count}`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

run();
