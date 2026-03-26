import { useEffect } from "react"

// ─── IMAGE MANIFEST ──────────────────────────────────────────────────────────
const IMG = {
  hero:    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85",
  story:   "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=85",
  place:   "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=85",
  market:  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=85",
  comps:   "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1600&q=85",
  team:    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=85",
  aerial:  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=85",
  lake:    "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1600&q=85",
  fairway: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&q=85",
  land:    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85",
}

const F = "sepia(6%) contrast(96%) brightness(98%)"

const C = {
  parchment:   "#F5F0E8",
  warmBlack:   "#1A1814",
  ink:         "#1C1C1A",
  gold:        "#8B6914",
  rule:        "#D9D0C0",
  muted:       "#7A736A",
  dark:        "#17120E",
}

const T = {
  label: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: C.muted,
    lineHeight: 1,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(3.5rem, 9vw, 7rem)",
    fontWeight: 700,
    lineHeight: 1.0,
    color: "#F5F0E8",
    textShadow: "0 4px 60px rgba(0,0,0,0.5)",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  h2: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2rem, 5vw, 3.4rem)",
    fontWeight: 700,
    lineHeight: 1.12,
    color: C.warmBlack,
    margin: 0,
  },
  h3: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
    fontWeight: 700,
    lineHeight: 1.2,
    color: C.warmBlack,
    margin: "56px 0 16px",
  },
  subhead: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)",
    fontStyle: "italic",
    fontWeight: 400,
    color: "rgba(245,240,232,0.65)",
    margin: 0,
    lineHeight: 1.5,
  },
  lede: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2rem, 4.5vw, 3rem)",
    fontWeight: 400,
    fontStyle: "italic",
    lineHeight: 1.3,
    color: C.warmBlack,
    textAlign: "center",
  },
  body: {
    fontFamily: "'EB Garamond', serif",
    fontSize: "clamp(17px, 1.8vw, 20px)",
    lineHeight: 1.82,
    color: C.ink,
  },
  pullQuote: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
    fontStyle: "italic",
    fontWeight: 400,
    lineHeight: 1.65,
    color: C.warmBlack,
    borderLeft: "3px solid #8B6914",
    paddingLeft: "28px",
    margin: "52px 0",
  },
  stat: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: C.warmBlack,
    lineHeight: 1,
    display: "block",
  },
  statLabel: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "10px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: C.muted,
    display: "block",
    marginTop: "10px",
  },
}

const col = { maxWidth: "680px", margin: "0 auto", padding: "0 28px" }

function Rule({ margin = "48px 0" }) {
  return <hr style={{ border: "none", borderTop: `1px solid ${C.rule}`, margin }} />
}

function Label({ children, light = false, style: extra = {} }) {
  return (
    <p style={{ ...T.label, color: light ? "rgba(245,240,232,0.35)" : C.muted, marginBottom: "16px", ...extra }}>
      {children}
    </p>
  )
}

function Body({ children, style: extra = {} }) {
  return (
    <p className="reveal" style={{ ...T.body, marginBottom: "1.7em", ...extra }}>
      {children}
    </p>
  )
}

function PullQuote({ children }) {
  return <blockquote className="reveal" style={T.pullQuote}>{children}</blockquote>
}

function StatRow({ stats }) {
  return (
    <div className="reveal" style={{
      display: "flex", gap: 0, flexWrap: "wrap",
      margin: "56px 0", padding: "40px 0",
      borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`,
    }}>
      {stats.map(({ value, label }, i) => (
        <div key={i} style={{ flex: "1 1 160px", padding: "8px 20px 8px 0" }}>
          <span style={T.stat}>{value}</span>
          <span style={T.statLabel}>{label}</span>
        </div>
      ))}
    </div>
  )
}

function ParallaxPanel({ src, height = "65vh", overlay = "rgba(15,10,6,0.52)", children }) {
  return (
    <div style={{ position: "relative", height, minHeight: "400px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="parallax-bg" style={{
        position: "absolute", inset: 0, top: "-15%", height: "130%",
        backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
        filter: F, willChange: "transform",
      }} />
      <div style={{ position: "absolute", inset: 0, background: overlay }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 28px", maxWidth: "760px" }}>
        {children}
      </div>
    </div>
  )
}

function ChapterHeader({ number, title, subtitle, src }) {
  return (
    <ParallaxPanel src={src} height="62vh" overlay="rgba(12,8,4,0.58)">
      <p style={{ ...T.label, color: "rgba(245,240,232,0.38)", marginBottom: "20px" }}>{number}</p>
      <h2 style={{ ...T.heroTitle, fontSize: "clamp(2.2rem, 6vw, 4.5rem)", marginBottom: "20px" }}>{title}</h2>
      {subtitle && <p style={T.subhead}>{subtitle}</p>}
    </ParallaxPanel>
  )
}

function InlineImage({ src, height = "50vh", caption }) {
  return (
    <div className="reveal" style={{ margin: "64px -28px" }}>
      <div style={{ position: "relative", height, overflow: "hidden" }}>
        <div className="parallax-bg" style={{
          position: "absolute", inset: 0, top: "-12%", height: "124%",
          backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
          filter: F, willChange: "transform",
        }} />
      </div>
      {caption && <p style={{ ...T.label, paddingTop: "12px", paddingLeft: "4px", color: C.muted }}>{caption}</p>}
    </div>
  )
}

function Prose({ children, bg = C.parchment, pt = "88px", pb = "88px" }) {
  return (
    <section style={{ background: bg, paddingTop: pt, paddingBottom: pb }}>
      <div style={col}>{children}</div>
    </section>
  )
}

function ChapterQuestion({ children }) {
  return (
    <div className="reveal" style={{ marginTop: "56px", paddingTop: "32px", borderTop: `1px solid ${C.rule}` }}>
      <Label>A question for the room</Label>
      <p style={{ ...T.body, fontStyle: "italic", color: C.muted }}>{children}</p>
    </div>
  )
}

function CompCard({ number, location, name, callout, children }) {
  return (
    <div className="reveal" style={{ paddingTop: "52px", marginTop: "52px", borderTop: `1px solid ${C.rule}` }}>
      <Label>Precedent {number} &mdash; {location}</Label>
      <h3 style={{ ...T.h3, marginTop: "8px", marginBottom: "0" }}>{name}</h3>
      <PullQuote>{callout}</PullQuote>
      {children}
    </div>
  )
}

function TeamMember({ role, name, children }) {
  return (
    <div className="reveal" style={{ paddingTop: "52px", marginTop: "52px", borderTop: `1px solid ${C.rule}` }}>
      <Label>{role}</Label>
      <h3 style={{ ...T.h3, marginTop: "8px", marginBottom: "20px" }}>{name}</h3>
      {children}
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    if (!gsap || !ScrollTrigger) return
    gsap.registerPlugin(ScrollTrigger)

    document.querySelectorAll(".parallax-bg").forEach(bg => {
      gsap.fromTo(bg,
        { yPercent: -8 },
        { yPercent: 8, ease: "none", scrollTrigger: {
          trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: 1.2,
        }}
      )
    })

    document.querySelectorAll(".reveal").forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 22, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 89%", toggleActions: "play none none none" },
      })
    })

    const tl = gsap.timeline({ delay: 0.3 })
    tl.from("#hero-byline", { opacity: 0, duration: 1.0, ease: "power2.out" })
      .from("#hero-title",  { opacity: 0, y: 48, duration: 1.6, ease: "power3.out" }, "-=0.5")
      .from("#hero-sub",    { opacity: 0, y: 16, duration: 1.0, ease: "power2.out" }, "-=0.9")
      .from("#hero-scroll", { opacity: 0, duration: 0.8 }, "-=0.4")

    gsap.to("#hero-scroll-line", {
      y: 8, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true,
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div style={{ background: C.parchment, color: C.ink }}>

      {/* HERO */}
      <section style={{
        position: "relative", height: "100vh", minHeight: "620px", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div className="parallax-bg" style={{
          position: "absolute", inset: 0, top: "-15%", height: "130%",
          backgroundImage: `url(${IMG.hero})`, backgroundSize: "cover", backgroundPosition: "center 35%",
          filter: F,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(170deg, rgba(10,7,4,0.25) 0%, rgba(10,7,4,0.45) 45%, rgba(10,7,4,0.82) 100%)",
        }} />
        <div id="hero-byline" style={{ position: "absolute", top: "36px", left: 0, right: 0, textAlign: "center", zIndex: 3 }}>
          <span style={{ ...T.label, color: "rgba(245,240,232,0.38)" }}>Work Architecture &nbsp;·&nbsp; March 2026</span>
        </div>
        <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "0 24px", maxWidth: "900px" }}>
          <h1 id="hero-title" style={T.heroTitle}>Estes Park</h1>
          <p id="hero-sub" style={{ ...T.subhead, fontSize: "clamp(1rem, 2.2vw, 1.35rem)", marginTop: "24px" }}>
            A Golf Destination for Generations
          </p>
        </div>
        <div id="hero-scroll" style={{
          position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)",
          zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        }}>
          <span style={{ ...T.label, color: "rgba(245,240,232,0.28)" }}>Scroll</span>
          <div id="hero-scroll-line" style={{
            width: "1px", height: "44px",
            background: "linear-gradient(to bottom, rgba(245,240,232,0.35), transparent)",
          }} />
        </div>
      </section>

      {/* OPENING LEDE */}
      <section style={{ background: C.parchment, padding: "120px 28px 96px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <p className="reveal" style={{ ...T.lede, marginBottom: "32px" }}>
            This is not a golf course.
          </p>
          <p className="reveal" style={{ ...T.body, fontSize: "clamp(18px, 2vw, 22px)", color: C.muted, textAlign: "center", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
            This is a chance to leave something indelible on 1,200 acres of Texas prairie
            that most people will never know existed. The question is not whether it can be built.
            The question is whether we have the vision to build it right.
          </p>
        </div>
      </section>

      {/* CHAPTER I: THE STORY */}
      <ChapterHeader number="Chapter I" title="The Story" subtitle="What does a place owe the people who will never know it existed?" src={IMG.story} />
      <Prose>
        <Body>
          There is a particular kind of project that does not come along often.
          Not the kind where the numbers align and the market is proven and the path of least resistance is obvious.
          The other kind. The kind where you look at a piece of land and feel something shift.
          Where the story the site is already telling is more compelling than anything a branding agency could invent.
        </Body>
        <Body style={{ fontWeight: 500, fontSize: "clamp(18px, 2vw, 21px)" }}>
          This is that project.
        </Body>
        <Body>
          Twelve hundred acres in Grand Prairie, Texas. Twenty minutes from one of the world's great airports.
          At the center of the fastest-growing major metropolitan area in the United States.
          On land that has been a seabed, a prairie, a Comanche hunting ground, a Mustang factory, a Navy airfield.
          On a peninsula crowned with elevation change that produces, if graded right,
          a 270-degree view of Mountain Creek Lake that no one in Dallas knows exists.
        </Body>
        <InlineImage src={IMG.aerial} height="45vh" caption="Aerial landscape — the scale of the opportunity" />
        <Body>
          The opportunity is not just financial, though the financial case is overwhelming.
          The opportunity is generational. Bandon Dunes transformed a dying Oregon fishing town into one of golf's
          holy sites in twenty-five years. Pinehurst has compounded mythology for one hundred and thirty.
          What was built in those places, the architecture, the land ethic, the walking culture,
          the accumulated stories of players and caddies and moments, outlasts every pro forma.
        </Body>
        <Body>
          That is what this conversation is about. Not what this project can earn. What it can become.
        </Body>
        <PullQuote>
          "The land has been a seabed, a prairie, a hunting ground, a battlefield, a cotton farm,
          a Mustang factory, and a Navy base. What it has never been is a place where people come
          to walk quietly through native grass and feel the particular silence that exists when a city
          of 8 million is 20 miles away but invisible."
        </PullQuote>
        <Body>
          Randy Hoffacker's first site read said it plainly. He wanted to feel lost out there.
          All the roofs low, single to two stories at most, so you don't have those markers
          telling you where you are in the world. He wanted the sense of escape. Not Dallas.
        </Body>
        <Body>
          That is the brief. That is the story. Everything that follows is the evidence that it's possible,
          and the argument that it is time.
        </Body>
        <ChapterQuestion>
          What does "leaving something indelible" mean to you for this project?
          What would make this worth pointing to in 50 years?
        </ChapterQuestion>
      </Prose>

      {/* CHAPTER II: THE PLACE */}
      <ChapterHeader number="Chapter II" title="The Place" subtitle="1,200 acres. 100 million years. One story no one has told." src={IMG.place} />
      <Prose>
        <Label>One hundred million years under water</Label>
        <h3 style={{ ...T.h3, marginTop: "8px" }} className="reveal">The Ground Beneath This Site Was Seafloor</h3>
        <Body>
          During the Late Cretaceous period, roughly 100 to 66 million years ago,
          the entire Grand Prairie corridor lay submerged beneath the Western Interior Seaway.
          A warm, subtropical inland ocean that split North America in half,
          connecting the Arctic to the Gulf of Mexico.
          Teeming with mosasaurs and plesiosaurs and vast colonies of microscopic algae,
          those creatures died by the trillions.
          Their calcium carbonate shells drifted to the seafloor and compressed over millennia
          into the hard white limestone formation now called the Austin Chalk.
        </Body>
        <Body>
          This matters. The Austin Chalk is the reason the land has topography at all.
          The formation dips eastward at 15 to 40 feet per mile, and where its hard western edge meets
          the softer Eagle Ford Shale beneath it, differential erosion has carved a prominent bluff
          called the White Rock Escarpment. Traceable for 350 miles from south of San Antonio through Dallas to Sherman.
          In the Mountain Creek Lake area, this escarpment produces approximately 100 feet of relief.
        </Body>
        <PullQuote>
          The "mountain" in Mountain Creek almost certainly references this feature.
          It is the only reason elevation change exists in an otherwise flat landscape,
          and it is the single most important geological asset on the property.
        </PullQuote>
        <InlineImage src={IMG.lake} height="42vh" caption="Mountain Creek Lake — the peninsula view no one in Dallas knows exists" />
        <Rule />
        <Label>Fifteen thousand years of human presence</Label>
        <Body>
          Human habitation of this prairie corridor extends to pre-Clovis times, over 15,000 years ago.
          The archaeological record along the Trinity River is substantial.
          Excavations near the Texas Horse Park unearthed nearly 3,000 prehistoric artifacts
          dating from 500 to 5,000 years old. Mammoth, mastodon, ancient camel,
          saber-tooth cat, and giant sloth remains found along the Trinity's banks.
        </Body>
        <Body>
          The Caddo called the Trinity River "Arkikosa." La Salle, encountering it in 1687,
          named it the River of Canoes, indicating heavy Indigenous watercraft use.
          The Wichita, Tonkawa, Comanche, and Kiowa all moved through this corridor.
          By 1841, the Village Creek settlements housed an estimated 10,000 inhabitants across 225 lodges:
          Caddo, Cherokee, Tonkawa, Creek, Seminole, Kickapoo, and Wichita peoples,
          many of them refugees displaced by prior waves of Indian Removal.
        </Body>
        <Rule />
        <Label>From broken wagon to Mustang factory</Label>
        <Body>
          Grand Prairie was founded in 1863 when Alexander McRae Dechman, hauling Confederate army supplies,
          broke his wagon on this stretch of prairie and traded his broken wagon and ox team
          for a 239-acre tract originally granted to the Caruth brothers in 1850.
        </Body>
        <Body>
          The defining chapter came on September 28, 1940, when North American Aviation broke ground
          on a plant west of Hensley Field. The first fully air-conditioned, artificially lit aircraft
          production facility in the United States. At peak production in April 1944,
          38,500 employees working three shifts produced 728 aircraft in a single 30-day period.
          A U.S. production record never surpassed.
          Grand Prairie's population exploded from 1,595 in 1940 to 18,000 by 1945.
        </Body>
        <Body>
          Mountain Creek Lake was created in 1936 and 1937 as a cooling reservoir for a steam-electric
          generating plant. At full pool it covers 2,710 acres with an average depth of just 8.5 feet.
          Shallow. Warm. Shaped by everything from naval aviation to environmental remediation.
        </Body>
        <Rule />
        <Label>On the name</Label>
        <Body>
          "Estes Park" is borrowed from a famous Colorado mountain town at 7,522 feet elevation,
          surrounded by 14,000-foot peaks, home to Rocky Mountain National Park
          and the hotel that inspired The Shining.
          Applying this name to a lakeside golf resort on Texas prairie creates immediate brand confusion.
        </Body>
        <Body>
          The great golf destinations named themselves from the land.
          Bandon Dunes describes sand dunes near the Oregon coast.
          Sand Valley names the prehistoric glacial dunes in central Wisconsin.
          The Fall Line references the geological escarpment between Georgia's Piedmont and Coastal Plain.
          The strongest names grow from something verifiably real about the site.
        </Body>
        <Body>
          This land offers the White Rock Escarpment, Mountain Creek, the Austin Chalk,
          and the Cross Timbers. Washington Irving described the Cross Timbers in 1832 as
          "struggling through forests of cast iron."
          The name this project earns should be as honest and irreplaceable as the land itself.
        </Body>
        <ChapterQuestion>
          What does this place remind you of?
          What name would you give it if you had to explain it to someone who had never been to Texas?
        </ChapterQuestion>
      </Prose>

      {/* CHAPTER III: THE MARKET */}
      <ChapterHeader number="Chapter III" title="The Market" subtitle="8.3 million reasons. And that's just the start." src={IMG.market} />
      <Prose>
        <Body>
          Grand Prairie sits at the geographic center of the largest population boom
          in modern American history. The DFW Metroplex added approximately 178,000 new residents
          in a single year. That is 487 people per day.
          At 8.34 million people, DFW's population now exceeds that of 38 U.S. states.
          If it were a state, it would rank 13th nationally, just behind Virginia, just ahead of Washington.
        </Body>
        <Body>
          This growth is structural, not cyclical.
          DFW grew through three national recessions, the dot-com bust, the 2008 financial crisis,
          and the pandemic. Fueled by corporate relocation, no state income tax,
          and a diversified economy across tech, healthcare, finance, and logistics,
          the metro is on track to surpass Chicago as the nation's third-largest within the decade.
        </Body>
        <PullQuote>The demand curves don't flatten here. They compound.</PullQuote>
        <StatRow stats={[
          { value: "8.3M",   label: "People within 45 minutes" },
          { value: "487",    label: "New residents per day" },
          { value: "20 min", label: "From DFW Airport" },
          { value: "#13",    label: "If DFW were a U.S. state" },
        ]} />
        <Body>
          Within 30 to 45 minutes of this site sits one of the most concentrated
          suburban wealth corridors in the nation. Southlake, median household income approaching $250,000.
          University Park at $389,000. Colleyville, Flower Mound, Prosper, Celina.
          Six DFW suburbs rank among the fastest-growing affluent communities in the entire country.
          These are the people who buy golf memberships, book luxury tee times, and spend on resort weekends.
          They are all within 30 minutes.
        </Body>
        <Rule />
        <h3 style={T.h3} className="reveal">Golf's Unprecedented Moment</h3>
        <Body>
          48.1 million Americans played golf in 2025. A record high.
          Twenty-one million non-golfers said they were "very interested" in playing on a course,
          the deepest prospect pipeline in golf history.
          Texas ranks second nationally in total golf participation.
          DFW has twelve Topgolf locations: twelve incubators feeding future golfers into the market.
        </Body>
        <StatRow stats={[
          { value: "48.1M", label: "Americans playing golf (2025)" },
          { value: "21M",   label: "Non-golfers interested in playing" },
          { value: "241K",  label: "New Texas golfers in 2023 alone" },
          { value: "4.5%",  label: "TX growth vs. 3.1% national rate" },
        ]} />
        <Body>
          The addressable market is not 8.3 million.
          DFW anchors the northern vertex of the Texas Triangle, a megaregion encompassing
          Dallas, Houston, San Antonio, and Austin that collectively houses approximately
          70% of Texas's 30 million residents. Houston is within a day's drive.
          Austin and San Antonio are a three-hour drive.
          The real addressable market is closer to 21 million people.
        </Body>
        <Rule />
        <h3 style={T.h3} className="reveal">PGA Frisco Already Proved It</h3>
        <Body>
          The question is not whether DFW can support a world-class golf resort.
          PGA Frisco already answered that: a $520 million public-private partnership
          on 660 acres in Frisco, with the PGA of America headquarters, a 500-room Omni resort,
          two championship courses, and a projected $2.5 billion economic impact over 20 years.
        </Body>
        <Body>
          But PGA Frisco is institutional. Corporate.
          The Omni is a convention hotel in golf clothing.
          What does not exist, anywhere in DFW, anywhere in Texas,
          is a boutique, walking-only, architecturally pure destination where the golf is the entire point.
          That gap is this project's open window.
        </Body>
        <PullQuote>
          Bandon Dunes serves 2.5 million people within driving distance.
          This site serves 8.3 million. The math is not close.
        </PullQuote>
        <ChapterQuestion>
          What would make you drive 20 minutes to play golf here instead of 20 minutes to your club?
          What justifies the premium beyond the course itself?
        </ChapterQuestion>
      </Prose>

      {/* CHAPTER IV: THE COMPS */}
      <ChapterHeader number="Chapter IV" title="The Comps" subtitle="It's been done before. Just never here." src={IMG.comps} />
      <Prose>
        <Body>
          The great golf destinations were not acts of faith.
          They were acts of studied conviction. Developers and architects who looked at what had worked elsewhere,
          understood exactly why it worked, and built something rooted in those principles
          but honest to their own land.
          What follows are the eight most relevant precedents for this project.
          Not for imitation. For ammunition.
        </Body>
        <CompCard number="01" location="Bandon, Oregon · Opened 1999" name="Bandon Dunes"
          callout="Built 4.5 hours from Portland. Needed 12,000 rounds to break even. Got 24,000. This site is 20 minutes from 8.3 million people. The risk here is categorically different.">
          <Body>
            A dying Oregon fishing and timber town. Population 2,800.
            Mike Keiser bought 1,215 acres of coastal duneland for approximately $1,975 per acre in 1991.
            A single great course that exceeded its break-even target by 2x in Year 1.
            Walking-only with caddies, not as a constraint but as a premium positioning decision.
            Remote destinations build mythological status through accumulated stories, not marketing.
          </Body>
          <Body>
            Today: approximately $99 million in estimated annual revenue across six courses.
            300 rooms. 800 employees. The largest private employer in Coos County.
          </Body>
        </CompCard>
        <CompCard number="02" location="Pinehurst, North Carolina · Founded 1895" name="Pinehurst"
          callout="$1.25 an acre for deforested land in 1895. One architect who never left. 130 years of compounding mythology. The $1/year lease on this site is the same story, a different century.">
          <Body>
            James Walker Tufts bought 5,800 acres of exhausted timberland for $1.25 per acre.
            Frederick Law Olmsted designed the village for $300.
            Donald Ross arrived in 1900 and stayed until his death in 1948.
            The Pinehurst model is village-first, golf-second: a walkable community
            where the course is the village green, not an isolated compound.
          </Body>
          <Body>
            U.S. Opens scheduled through 2047. National Historic Landmark. "Home of American Golf."
            More than $2 billion in estimated economic impact to North Carolina.
          </Body>
        </CompCard>
        <InlineImage src={IMG.fairway} height="44vh" caption="The architecture does the work the land cannot do alone" />
        <CompCard number="03" location="Kohler, Wisconsin · Opened 1998" name="Whistling Straits"
          callout="800,000 cubic yards of imported sand on a flat Army airfield. The 2021 Ryder Cup alone generated $135M in economic impact. The land doesn't have to be dramatic. The architecture does.">
          <Body>
            A pancake-flat abandoned U.S. Army airfield on the western shore of Lake Michigan.
            Pete Dye imported 800,000 cubic yards of earth and sculpted an Irish links-style course from nothing.
            The most transformative sites often look like liabilities before the architect arrives.
            Kohler's model, brand architecture as total design philosophy,
            created an identity so coherent that every building, every hole, every detail reinforces the same story.
          </Body>
        </CompCard>
        <CompCard number="04" location="Bowling Green, Florida · Opened 2012" name="Streamsong"
          callout="Industrial waste land that looks like Scotland. 90 minutes from Tampa. 90,000 rounds a year. Streamsong didn't apologize for its land. It made the land the point. This site has better bones.">
          <Body>
            Phosphate mining waste land in central Florida.
            Fifteen million cubic yards of sand created links-like dunes from what was otherwise industrial ruin.
            Effective land basis: zero.
            Terrain character matters more than terrain pedigree.
            The story of the land matters more than the land's conventional attractiveness.
            Sold in 2023 for $160 million to KemperSports.
          </Body>
        </CompCard>
        <CompCard number="05" location="Nekoosa, Wisconsin · Opened 2017" name="Sand Valley"
          callout="Sold out its first season. Three hours from any major city. Sand Valley proves the model scales. With 8.3 million people within 30 minutes, the demand math here is fundamentally better from day one.">
          <Body>
            Prehistoric glacial dunes in central Wisconsin, three or more hours from Milwaukee and Chicago.
            Launched with 50 rooms and one course.
            Now four courses and 118 rooms, with founders having paid $50,000 each.
            160 founding members generated $8 million in pre-opening capital.
            Phase 1 discipline, one great course plus minimal lodging done perfectly,
            builds the conviction for Phase 2 faster than an overbuilt Phase 1.
          </Body>
        </CompCard>
        <CompCard number="06" location="Frisco, Texas · Opened 2023" name="PGA Frisco"
          callout="$520 million proves DFW supports destination golf at massive scale. The boutique segment, walking-only, architecturally pure, intimate, is completely empty. PGA Frisco is not the competition. It's the proof of concept.">
          <Body>
            A $520 million public-private partnership.
            The PGA of America headquarters. A 500-key Omni hotel with 127,000 square feet of convention space.
            DFW's public-private partnership appetite is proven and sophisticated.
            TIRZ, Chapter 380, state HOT rebates, direct city investment: all executed successfully at this scale.
            The adjacent Fields master plan projects $10 to $12.7 billion in buildout.
          </Body>
        </CompCard>
        <CompCard number="07" location="Inverness, Nova Scotia · Opened 2012" name="Cabot Cape Breton"
          callout="Reversed a generation of out-migration from a dead coal town. 500 jobs. Cottages that sold for $10,000 now fetch $150,000. The best precedent for what destination golf does to a community that's been overlooked.">
          <Body>
            A hollowed-out coal mining town. The mines closed in 1958.
            For decades, young people fled to Alberta.
            The inverse of the Bandon model: Cabot was community transformation as explicit mission, not byproduct.
            Workforce development and youth employment programs transformed a resort
            from luxury imposition to community institution.
            That is the move for Grand Prairie's diverse, working-class constituency.
          </Body>
        </CompCard>
        <CompCard number="08" location="Mt. Enterprise, Texas · Opening Fall 2026" name="Wild Spring Dunes"
          callout="The Keiser family's GM said it himself: 'Texas doesn't have a really great golf resort yet.' He's building one 175 miles from Dallas. This site is 20 minutes from Dallas. The category he's proving, we're building at the center of the market.">
          <Body>
            2,400 acres in the East Texas piney woods, approximately 175 miles from Dallas.
            Remote pilgrimage model.
            Founding deposits escalated from $65,000 to $115,000 as milestones hit.
            Wild Spring serves the dedicated pilgrim who will drive three hours for an extraordinary experience.
            This project serves everyone else.
            The markets are more complementary than competitive.
          </Body>
        </CompCard>
        <ChapterQuestion>
          Which of these precedents resonates most with what you want this project to become?
          What does this site have that none of them had?
        </ChapterQuestion>
      </Prose>

      {/* CHAPTER V: THE TEAM */}
      <ChapterHeader number="Chapter V" title="The Team" subtitle="Each person in this room brings something no one else can." src={IMG.team} />
      <Prose>
        <Body>
          This project does not succeed with the wrong people around the table.
          It also does not succeed with the right people who don't fully understand each other.
          What follows is who is here and what they bring.
        </Body>
        <TeamMember role="Master Planner — Work Architecture" name="Randy Hoffacker">
          <Body>
            Randy Hoffacker is the spatial architect of this vision.
            The person who translates between what a great golf course needs
            and what a great resort requires.
            With deep experience in golf course master planning and a prior working history
            with Escalante Golf properties, Randy brought the first site read that set the tone for everything.
          </Body>
          <Body>
            He wanted to feel lost out there.
            All the roofs low, single to two stories at most,
            so you don't have those markers telling you where you are in the world.
            He wanted the sense of escape. Not Dallas.
          </Body>
          <Body>
            His background in construction management means he does not just design programs.
            He designs ones that can actually be built.
            His CAD files already contain the vocabulary Escalante and OCM need to see.
            He is the bridge between inspiration and buildability.
          </Body>
        </TeamMember>
        <TeamMember role="President — Escalante Golf" name="David McDonald">
          <Body>
            David McDonald has built Escalante into the most distinctive boutique golf operator in America.
            25 properties across 17 states.
            From ultra-exclusive Canyata, a Top 100 World property approaching $1 million entry,
            to walking-only Kingsley Club in Michigan,
            to the 350-room Kingsmill Resort in Virginia.
            His company's stated identity: a national reach and scale that is uniquely boutique in nature.
          </Body>
          <Body>
            McDonald walked away from a $100 million golf project in Aledo, Texas in January 2024
            rather than compromise on operational control and brand authority.
            That tells you everything.
            He needs equity ownership or co-ownership, architect selection authority,
            and absolute control over quality standards.
            Estes Park is his second attempt at the DFW flagship he has always needed.
          </Body>
          <Body>
            He is not a client who needs convincing that world-class golf is worth building.
            He has already built it 25 times.
            He needs confidence that this team and this city can deliver the project his name goes on.
          </Body>
        </TeamMember>
        <TeamMember role="Golf Course Architect / Design-Build" name="OCM Golf">
          <Body>
            OCM Golf is the design-build firm for this project.
            Geoff Ogilvy, Mike Cocking, and Ashley Mead represent something
            that does not exist anywhere else in golf architecture:
            a firm that designs, builds, and maintains its own work.
            From first concept sketch through construction, grow-in, and agronomic consultation.
          </Body>
          <Body>
            Geoff Ogilvy is the 2006 U.S. Open Champion at Winged Foot.
            He grew up on Melbourne's Sandbelt courses.
            He has said, plainly, that they don't like punitive stuff,
            that the great courses bring the 18-handicapper and the scratch golfer closer together.
            Their first U.S. project was Shady Oaks in Fort Worth.
            Their Luling Sport course will be their first walking-only project in Texas,
            a direct precedent for this work.
          </Body>
        </TeamMember>
        <TeamMember role="Mayor — City of Grand Prairie" name="Mayor Ron Jensen">
          <Body>
            Ron Jensen has been Grand Prairie's mayor since 2013. Five terms.
            He has spent that time executing a single clear vision:
            transforming Grand Prairie from a pass-through suburb into a destination city.
            His strategy is explicit.
            Housing is going to come, but housing does not pay the bills.
          </Body>
          <Body>
            His track record: $165 million or more in the EpicCentral entertainment district,
            the Goodland annexation of 1,500 acres and 50,000 projected residents,
            Major League Cricket headquarters relocation from San Francisco,
            and a $327 million general obligation bond on the May 2026 ballot.
            Grand Prairie holds an AAA S&amp;P bond rating. The highest possible.
            Ranked second nationally in permitting efficiency in 2025.
          </Body>
          <Body>
            He will champion this project.
            But he needs it framed as community benefit for a diverse, working-class constituency.
            Every element that answers "Why does this serve Grand Prairie?" makes his job easier.
          </Body>
        </TeamMember>
        <ChapterQuestion>
          Who else belongs at this table?
          What expertise or perspective is missing that would make the project stronger?
        </ChapterQuestion>
      </Prose>

      {/* CHAPTER VI: THE LOOP */}
      <section style={{ background: C.dark, padding: "100px 28px 120px" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <Label light style={{ marginBottom: "28px" }}>Chapter VI</Label>
          <h2 className="reveal" style={{ ...T.h2, color: "#F5F0E8", marginBottom: "12px" }}>
            This Document Isn't Finished.
          </h2>
          <h2 className="reveal" style={{ ...T.h2, color: "rgba(245,240,232,0.4)", fontStyle: "italic", fontWeight: 400, marginBottom: "52px" }}>
            Neither Is the Vision.
          </h2>
          <p className="reveal" style={{ ...T.body, color: "rgba(245,240,232,0.62)", marginBottom: "1.6em" }}>
            Everything you've read here was assembled from public records, site data, market research,
            and the conversations that have already happened about this place.
            It is as complete as one team can make it. But it is not finished.
          </p>
          <p className="reveal" style={{ ...T.body, color: "rgba(245,240,232,0.62)", marginBottom: "1.6em" }}>
            The next version of this document will reflect what you think.
            What you know that is not here. What precedent we missed.
            What moment from your own career changes the way this project should be told.
          </p>
          <p className="reveal" style={{ ...T.body, color: "rgba(245,240,232,0.62)", marginBottom: "64px" }}>
            Not a survey. A genuine request for the intelligence that only you can provide.
          </p>
          <form id="loop-form" className="reveal"
            action="https://formspree.io/f/xaqlygol" method="POST"
            onSubmit={e => {
              e.preventDefault()
              const form = e.target
              fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
                .then(() => { form.style.display = "none"; document.getElementById("loop-confirm").style.display = "block" })
                .catch(() => {})
            }}
          >
            {[
              { label: "Name (optional)", name: "name", type: "input" },
            ].map(({ label, name }) => (
              <div key={name} style={{ marginBottom: "28px" }}>
                <label style={{ ...T.label, color: "rgba(245,240,232,0.3)", display: "block", marginBottom: "10px" }}>{label}</label>
                <input type="text" name={name} style={{
                  width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(245,240,232,0.1)",
                  borderRadius: "1px", padding: "13px 16px", color: "#F5F0E8",
                  fontFamily: "'EB Garamond', serif", fontSize: "19px", outline: "none", boxSizing: "border-box",
                }} />
              </div>
            ))}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ ...T.label, color: "rgba(245,240,232,0.3)", display: "block", marginBottom: "10px" }}>Which section are you responding to?</label>
              <select name="section" style={{
                width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(245,240,232,0.1)",
                borderRadius: "1px", padding: "13px 16px", color: "#F5F0E8",
                fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase",
                outline: "none", boxSizing: "border-box", appearance: "none", cursor: "pointer",
              }}>
                {["The Story","The Place","The Market","The Comps","The Team","Something Else"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ ...T.label, color: "rgba(245,240,232,0.3)", display: "block", marginBottom: "10px" }}>Your response</label>
              <textarea name="response" required rows={7} style={{
                width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(245,240,232,0.1)",
                borderRadius: "1px", padding: "13px 16px", color: "#F5F0E8",
                fontFamily: "'EB Garamond', serif", fontSize: "19px", lineHeight: 1.65,
                outline: "none", resize: "vertical", boxSizing: "border-box",
              }} />
            </div>
            <div style={{ marginBottom: "48px" }}>
              <label style={{ ...T.label, color: "rgba(245,240,232,0.3)", display: "block", marginBottom: "10px" }}>May we quote you in the next version?</label>
              <select name="quote_permission" style={{
                width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(245,240,232,0.1)",
                borderRadius: "1px", padding: "13px 16px", color: "#F5F0E8",
                fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase",
                outline: "none", boxSizing: "border-box", appearance: "none", cursor: "pointer",
              }}>
                <option value="yes">Yes</option>
                <option value="yes_anon">Yes, anonymously</option>
                <option value="no">No</option>
              </select>
            </div>
            <button type="submit" style={{
              background: "transparent", border: "1px solid rgba(245,240,232,0.22)",
              color: "rgba(245,240,232,0.7)", padding: "15px 36px",
              fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(245,240,232,0.07)"; e.target.style.borderColor = "rgba(245,240,232,0.4)"; e.target.style.color = "#F5F0E8" }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(245,240,232,0.22)"; e.target.style.color = "rgba(245,240,232,0.7)" }}
            >
              Send your thinking
            </button>
          </form>
          <div id="loop-confirm" style={{ display: "none" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.1rem, 2vw, 1.35rem)", fontStyle: "italic", color: "rgba(245,240,232,0.55)", lineHeight: 1.6 }}>
              Your thinking is now part of the project. Thank you.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#100D09", padding: "52px 28px", borderTop: "1px solid rgba(245,240,232,0.05)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...T.label, color: "rgba(245,240,232,0.18)", marginBottom: "16px" }}>Work Architecture</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", color: "rgba(245,240,232,0.18)", lineHeight: 1.8, margin: "0 0 10px" }}>
            This portal was built as a living intelligence document for the Estes Park design charrette,
            March 31 through April 2, 2026. It will be updated as the project evolves.
          </p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", color: "rgba(245,240,232,0.12)" }}>
            Questions:{" "}
            <a href="mailto:ericwhitmore@gmail.com" style={{ color: "rgba(245,240,232,0.22)", textDecoration: "none" }}>
              ericwhitmore@gmail.com
            </a>
            {" · "}Version 2.0
          </p>
        </div>
      </footer>

    </div>
  )
}
