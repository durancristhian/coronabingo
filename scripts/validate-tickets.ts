import { readFileSync } from 'fs'
import { join } from 'path'
import { validateTicketCatalog } from './ticket-catalog'

validateTicketCatalog(
  JSON.parse(readFileSync(join(__dirname, '../public/tickets.json'), 'utf8')),
  JSON.parse(
    readFileSync(join(__dirname, '../public/tickets-metadata.json'), 'utf8'),
  ),
)
console.log(
  'Ticket catalog counts, capacity and shared-number limits are valid.',
)
