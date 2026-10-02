import { Link } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { IPhoneHandoff } from '../components/IPhoneHandoff';
import { AppStoreButton } from '../components/AppStoreButton';
export function FirstAquarium() {
  return <><Nav variant="inner" /><main className="first-aquarium">
    <section className="first-aquarium-hero">
      <p className="first-aquarium-eyebrow">Your first aquarium · iPhone</p>
      <h1>Start with one tank.<br />Build a useful history.</h1>
      <p className="first-aquarium-lead">Your first water test is a starting point. Keep the next one beside it, so you can review what changed.</p>
      <AppStoreButton /><IPhoneHandoff />
      <p>Free to download. One primary aquarium, readings and maintenance tasks to get started.</p>
    </section>
    <section aria-labelledby="start-steps"><h2 id="start-steps">A simple first session</h2>
      <ol className="first-aquarium-steps">
        <li><span>01</span><h3>Create your aquarium</h3><p>Choose its type and volume. Keep its readings and care records together.</p></li>
        <li><span>02</span><h3>Record a test you measured</h3><p>Enter your water test result. Reef Keeper records your input; it does not measure water automatically.</p></li>
        <li><span>03</span><h3>Plan your next check</h3><p>Create a maintenance task, then return to your records after the next test. Reminders depend on your notification settings.</p></li>
      </ol>
    </section>
    <section className="first-aquarium-note"><h2>Starting a new tank?</h2><p>The app includes a New Tank Cycle care plan for organizing check-ins. A record or completed task does not prove the aquarium is ready for livestock. Base decisions on measured conditions and appropriate aquarium guidance.</p>
      <Link to="/blog/$slug" params={{ slug: 'new-tank-syndrome-nitrogen-cycle' }}>Read the nitrogen cycle guide →</Link>
    </section>
    <section><h2>Grow your records at your pace</h2><p>Pro adds more aquariums, advanced trend ranges and data export. You can begin your first aquarium record before deciding whether you need Pro.</p><AppStoreButton /></section>
  </main><MiniFooter /></>;
}
