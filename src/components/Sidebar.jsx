import { Link } from 'react-router-dom'

function Sidebar({ items }) {
  return (
    <aside>
      <h3>Menú</h3>

      <ul>
        {items.map((item) => (
          <li key={item}>
            <Link to={`/${item.toLowerCase()}`}>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar