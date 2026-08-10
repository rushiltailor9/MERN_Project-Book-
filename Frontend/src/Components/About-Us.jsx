
import '../CSS/About-Us.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <section className="about-hero">
        <div className="about-content">
          <p className="about-tag">About ReadEasy</p>
          <h1>Discover books without the overwhelm.</h1>
          <p>
            Welcome to ReadEasy — where finding your next great read shouldn't feel like a chore.
            We built ReadEasy because we know the feeling of staring at endless bestseller lists,
            scrolling through reviews, and still not knowing what to read next.
          </p>
          <p>
            Whether you're a casual reader looking for a weekend escape, a busy parent squeezing in a
            chapter before bed, or a lifelong bookworm always hunting for your next obsession,
            ReadEasy is designed with you in mind.
          </p>
        </div>

        <div className="about-highlights">
          <div className="highlight-card">
            <h3>Simple discovery</h3>
            <p>Clear recommendations and honest reviews to help you choose with confidence.</p>
          </div>
          <div className="highlight-card">
            <h3>Built for readers</h3>
            <p>No jargon, no gatekeeping — just great books made easy to find.</p>
          </div>
          <div className="highlight-card">
            <h3>Our mission</h3>
            <p>Make reading accessible, enjoyable, and stress-free for everyone.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs