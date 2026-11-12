export default function Spinner({ full }) {
  return <div className={full ? 'spinner-full' : 'spinner-inline'}><div className="spinner" /></div>
}
