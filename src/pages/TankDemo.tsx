import { useState } from 'react';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { AppStoreButton } from '../components/AppStoreButton';
export function TankDemo() {
  const [reading, setReading] = useState(18);
  const [saved, setSaved] = useState<number | null>(null);
  const [task, setTask] = useState<'none' | 'planned' | 'done'>('none');
  return <><Nav variant="inner" /><main className="first-aquarium tank-demo">
    <p className="first-aquarium-eyebrow">Interactive illustration · fictional data</p>
    <h1>A reading. A trend.<br />Your next check.</h1>
    <p className="first-aquarium-lead">Explore a sample logbook for “Demo Reef”. This is a simplified web illustration, not the iPhone app. Nothing is saved after refresh.</p>
    <p>No real aquarium data is needed. These numbers are examples, not target ranges or care advice.</p>
    <div className="first-aquarium-steps">
      <section className="demo-step"><h2>1. Record</h2><label htmlFor="sample-reading">Choose a fictional nitrate reading</label><select id="sample-reading" value={reading} onChange={event => setReading(Number(event.target.value))}><option value={18}>18 ppm (sample)</option><option value={22}>22 ppm (sample)</option></select><button onClick={() => {setSaved(reading); setTask('none');}}>Record sample reading</button></section>
      <section className="demo-step"><h2>2. Review</h2>{saved === null ? <p>Record a sample reading to see it alongside two earlier examples.</p> : <><p role="status">Sample reading recorded: {saved} ppm.</p><svg viewBox="0 0 260 130" role="img" aria-label={`Fictional nitrate readings: 12, 17, ${saved} ppm. Not a diagnosis.`}><polyline points={`20,110 130,70 240,${110-(saved-12)*8}`} fill="none" stroke="#17627a" strokeWidth="4" />{[12,17,saved].map((value,index) => <circle key={index} cx={20+110*index} cy={110-(value-12)*8} r="5" fill="#17627a" />)}</svg><table><caption>Fictional nitrate history</caption><thead><tr><th scope="col">Sample test</th><th scope="col">ppm</th></tr></thead><tbody>{[12,17,saved].map((value,index) => <tr key={index}><th scope="row">{index+1}</th><td>{value}</td></tr>)}</tbody></table></>}</section>
      <section className="demo-step"><h2>3. Plan</h2><p>Choose to record another test as your next sample task. No notifications are scheduled.</p><button disabled={saved === null || task !== 'none'} onClick={() => setTask('planned')}>Add sample retest task</button>{task !== 'none' && <div role="status"><p>{task === 'done' ? 'Sample task completed.' : 'Sample task planned: Retest nitrate.'}</p><label><input type="checkbox" checked={task === 'done'} onChange={event => setTask(event.target.checked ? 'done' : 'planned')} /> Mark sample task complete</label></div>}</section>
    </div>
    <button className="demo-reset" onClick={() => {setReading(18);setSaved(null);setTask('none');}}>Reset demo</button>
    <section><h2>Ready to start your own record?</h2><p>Download Reef Keeper on your iPhone. Demo entries are not transferred to the app.</p><AppStoreButton /></section>
  </main><MiniFooter /></>;
}
