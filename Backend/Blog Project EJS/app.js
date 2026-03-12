import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// View engine setup - EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// In-memory data store
let posts = [
    {
        id: 1,
        title: "The Power of Faith in Uncertain Times",
        excerpt: "In moments of darkness, faith becomes our anchor. When the world around us shakes, we find strength in the unchanging promises of God.",
        content: `In moments of darkness and uncertainty, faith becomes our anchor. When the world around us shakes, we find our strength not in circumstances, but in the unchanging promises of God.

The apostle Paul wrote from a Roman prison, "I have learned in whatever situation I am to be content. I know how to be brought low, and I know how to abound. In any and every circumstance, I have learned the secret of facing plenty and hunger, abundance and need. I can do all things through him who strengthens me." (Philippians 4:11-13)

This contentment Paul speaks of is not passive resignation. It is an active trust—a deliberate choice to believe that God's purposes are higher than our understanding. When we cannot see the path ahead, we walk by faith, not by sight.

Consider Abraham, who left everything familiar to follow God's call to an unknown land. Consider Joseph, who endured betrayal and imprisonment yet never abandoned his faith. Consider the early church, persecuted yet growing stronger with each trial.

Their faith was not blind optimism. It was grounded in the character of God—His faithfulness, His love, His sovereignty over all things. They understood that trials produce perseverance, and perseverance produces character, and character produces hope.

Today, whatever you face, remember this: your circumstances do not define your God. He remains sovereign over every storm, every setback, every sleepless night. The same God who parted the Red Sea, who shut the mouths of lions, who raised Christ from the dead—He is with you now.

Stand firm in faith. Not because the path is easy, but because the One who walks with you is faithful.`,
        author: "Pastor David Mitchell",
        date: "March 10, 2026",
        category: "Faith",
        readTime: 5,
        featured: true
    },
    {
        id: 2,
        title: "Grace: The Foundation of Christian Life",
        excerpt: "Grace is not merely God's response to our failures—it is the very foundation upon which our relationship with Him is built.",
        content: `Grace is perhaps the most misunderstood concept in Christianity. Many see it simply as God's willingness to forgive our mistakes. But grace is far more profound—it is the very foundation upon which our entire relationship with God is built.

"For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast." (Ephesians 2:8-9)

These words from Paul strike at the heart of human pride. We are conditioned to earn everything—respect, success, love. Yet God's economy operates differently. His greatest gift cannot be earned because it was never meant to be. Grace is freely given to those who could never deserve it.

This is not a license for careless living. Rather, it is an invitation to freedom. When we truly grasp that we are loved not for what we do but for who we are in Christ, something shifts within us. We no longer serve God out of obligation or fear. We serve Him out of gratitude and love.

The Pharisees of Jesus' day missed this entirely. They had reduced faith to a checklist of rules and regulations. They measured their righteousness by their own standards and found themselves adequate. But Jesus saw through their self-deception: "Those who are well have no need of a physician, but those who are sick. I came not to call the righteous, but sinners." (Mark 2:17)

Grace humbles us. It reminds us that we all stand equally in need of God's mercy. The most devout believer and the most wayward sinner approach the throne of grace on the same terms—empty-handed, fully dependent on Christ's finished work.

Today, let grace transform not only how you see yourself, but how you see others. Extend the same mercy you have received. Forgive as you have been forgiven. Love as you have been loved.

This is the Christian life—not a performance, but a response to overwhelming grace.`,
        author: "Sarah Thompson",
        date: "March 8, 2026",
        category: "Theology",
        readTime: 6,
        featured: false
    },
    {
        id: 3,
        title: "Prayer: Communion with the Living God",
        excerpt: "Prayer is not about changing God's mind—it is about aligning our hearts with His will and experiencing His presence.",
        content: `Prayer remains one of the great mysteries of the Christian faith. How does an infinite, all-knowing God invite finite, limited humans into conversation? Why would the Creator of the universe concern Himself with our daily concerns?

Yet throughout Scripture, we see God eagerly inviting His people into prayer. "Call to me and I will answer you, and will tell you great and hidden things that you have not known." (Jeremiah 33:3)

Prayer is not about informing God of things He doesn't know. It is not a negotiation where we try to change His mind. Prayer is communion—a genuine, intimate connection with the Living God.

Jesus modeled this intimacy. Despite His demanding ministry, He regularly withdrew to pray. Before major decisions, He prayed. In His darkest hour at Gethsemane, He prayed. His prayer life was not a religious obligation but a lifeline—a constant connection to the Father.

"Our Father in heaven, hallowed be your name..." These opening words of the Lord's Prayer reveal something profound. We approach God not as servants to a distant master, but as children to a loving Father. His name is holy—set apart, worthy of reverence—yet He draws us close.

Many struggle with prayer because they approach it as a technique to be mastered rather than a relationship to be cultivated. They worry about saying the right words, praying long enough, or achieving some mystical state. But prayer at its simplest is honest conversation with God.

Bring Him your gratitude and your grief. Your hopes and your fears. Your confessions and your questions. He can handle your doubt. He welcomes your honesty. He is not looking for polished prayers from perfect people. He is looking for authentic hearts that seek His face.

"Draw near to God, and he will draw near to you." (James 4:8)

This is His promise. Not that every prayer will be answered as we expect, but that He will meet us. In the silence and in the storm, in the waiting and in the breakthrough—He is there, listening, working, loving.

Pray without ceasing. Not as a burden, but as a breath. Let prayer become as natural as conversation with your closest friend. For that is exactly what it is.`,
        author: "Pastor David Mitchell",
        date: "March 5, 2026",
        category: "Spiritual Growth",
        readTime: 7,
        featured: false
    },
    {
        id: 4,
        title: "The Call to Love Our Neighbors",
        excerpt: "Loving our neighbor is not optional in the Christian faith—it is the defining mark of those who follow Christ.",
        content: `When a lawyer asked Jesus which commandment was the greatest, His answer surprised everyone. He did not cite a ritual law or a ceremonial requirement. He pointed to love.

"You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself." (Matthew 22:37-39)

Notice that Jesus did not separate these commands. Love for God and love for neighbor are intertwined. You cannot claim to love God while harboring hatred or indifference toward the people He created. "If anyone says, 'I love God,' and hates his brother, he is a liar; for he who does not love his brother whom he has seen cannot love God whom he has not seen." (1 John 4:20)

But who is our neighbor? A lawyer once asked Jesus this very question, hoping to justify himself. In response, Jesus told the parable of the Good Samaritan—a story that shattered every comfortable boundary His listeners had constructed.

The neighbor is not just the person who looks like you, thinks like you, or lives near you. The neighbor is anyone in need whom you have the capacity to help. The Samaritan crossed religious, ethnic, and social boundaries to care for a wounded stranger. His compassion was not theoretical—it cost him time, money, and convenience.

In our divided world, this command is more relevant than ever. We are quick to love those in our tribe and dismiss those outside it. We engage in political warfare while ignoring the humanity of those we oppose. We speak of Christian values while failing to practice the most fundamental one.

True Christian love is not sentimentality. It is action. It feeds the hungry, clothes the naked, visits the prisoner, welcomes the stranger. It does not ask whether the person is deserving—grace has already settled that question. We love because we were first loved.

Today, consider: who is your neighbor? Perhaps it is the coworker everyone avoids. The family member who has wronged you. The homeless person you pass each day. The immigrant whose presence makes you uncomfortable.

Love is not easy. It requires sacrifice, patience, and courage. But it is the defining mark of those who follow Christ. By this all people will know that you are His disciples—if you have love for one another.`,
        author: "Rev. Michael Chen",
        date: "March 1, 2026",
        category: "Christian Living",
        readTime: 6,
        featured: false
    },
    {
        id: 5,
        title: "Finding Rest in a Restless World",
        excerpt: "In a culture that glorifies busyness, the biblical call to rest is not weakness—it is an act of trust in a God who never sleeps.",
        content: `We live in an age of perpetual motion. Our devices buzz with notifications. Our calendars overflow with commitments. Our minds race even when our bodies are still. Rest has become a luxury few can afford—or so we tell ourselves.

Yet from the very beginning, God built rest into the fabric of creation. "And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done." (Genesis 2:2)

God did not rest because He was tired. He rested to establish a pattern—a rhythm of work and renewal that reflects His design for human flourishing. The Sabbath was not a burden imposed on Israel; it was a gift. A weekly reminder that their worth was not measured by productivity.

Jesus extended this invitation to weary souls: "Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls." (Matthew 11:28-29)

Notice that Jesus does not promise rest from labor, but rest in labor. His yoke is easy and His burden is light—not because the work disappears, but because we no longer carry it alone. We are yoked to Him, and He bears the weight.

Our restlessness often reveals a deeper spiritual condition. We stay busy to avoid silence. We fill our schedules to feel important. We measure our worth by our output because we have forgotten that our identity is secure in Christ. But the gospel frees us from this exhausting performance.

You do not have to prove yourself. You do not have to earn God's approval. You do not have to carry the weight of the world on your shoulders. Christ has already done what you could never do. Your task is not to save yourself or fix everything—your task is to trust and obey.

Practicing rest is an act of faith. It declares that God is sovereign over our time, our work, and our circumstances. It acknowledges that the world will continue turning even when we step back. It trusts that God's provision does not depend on our striving.

Today, consider what true rest might look like for you. Perhaps it means setting boundaries on work. Perhaps it means creating space for silence and solitude. Perhaps it means releasing the anxiety that keeps you up at night.

Whatever form it takes, rest is not optional for the Christian. It is obedience. It is worship. It is trust in a God who neither slumbers nor sleeps.`,
        author: "Dr. Elizabeth Warren",
        date: "February 25, 2026",
        category: "Spiritual Growth",
        readTime: 6,
        featured: false
    }
];

let nextId = 6;

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Helper function to calculate read time
function calculateReadTime(content) {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
}

// Helper function to get excerpt from content
function createExcerpt(content, length = 150) {
    if (content.length <= length) return content;
    return content.substring(0, length).trim() + "...";
}

// Routes

// Home - Display all posts
app.get("/", (req, res) => {
    const featuredPost = posts.find(p => p.featured);
    const recentPosts = posts.filter(p => !p.featured).slice(0, 6);
    
    res.render("home", { 
        featuredPost,
        recentPosts,
        pageTitle: "Faithful Word"
    });
});

// About page
app.get("/about", (req, res) => {
    res.render("about", {
        pageTitle: "About | Faithful Word"
    });
});

// Create new post form
app.get("/posts/new", (req, res) => {
    res.render("create", {
        pageTitle: "Write | Faithful Word"
    });
});

// Create new post - POST
app.post("/posts", (req, res) => {
    const { title, excerpt, content, author, category } = req.body;
    
    const newPost = {
        id: nextId++,
        title: title.trim(),
        excerpt: excerpt.trim() || createExcerpt(content),
        content: content.trim(),
        author: author.trim(),
        category,
        date: formatDate(new Date()),
        readTime: calculateReadTime(content),
        featured: false
    };
    
    posts.unshift(newPost);
    res.redirect(`/posts/${newPost.id}`);
});

// View single post
app.get("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    
    if (!post) {
        return res.status(404).render("404", {
            pageTitle: "Not Found | Faithful Word"
        });
    }
    
    // Get related posts (same category, excluding current)
    const relatedPosts = posts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 2);
    
    res.render("post", {
        post,
        relatedPosts,
        pageTitle: `${post.title} | Faithful Word`
    });
});

// Edit post form
app.get("/posts/:id/edit", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    
    if (!post) {
        return res.status(404).render("404", {
            pageTitle: "Not Found | Faithful Word"
        });
    }
    
    res.render("edit", {
        post,
        pageTitle: `Edit | Faithful Word`
    });
});

// Update post - PUT
app.put("/posts/:id", (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
        return res.status(404).render("404", {
            pageTitle: "Not Found | Faithful Word"
        });
    }
    
    const { title, excerpt, content, author, category } = req.body;
    
    posts[postIndex] = {
        ...posts[postIndex],
        title: title.trim(),
        excerpt: excerpt.trim() || createExcerpt(content),
        content: content.trim(),
        author: author.trim(),
        category,
        readTime: calculateReadTime(content)
    };
    
    res.redirect(`/posts/${req.params.id}`);
});

// Delete post - DELETE
app.delete("/posts/:id", (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
    }
    
    res.redirect("/");
});

// 404 handler
app.use((req, res) => {
    res.status(404).render("404", {
        pageTitle: "Not Found | Faithful Word"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Faithful Word Blog running at http://localhost:${PORT}`);
});
