import classnames from 'classnames'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode } from 'react'
import {
  FiCheck,
  FiCopy,
  FiFrown,
  FiInfo,
  FiPlayCircle,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiSettings,
  FiShare2,
  FiSmile,
  FiTrash2,
  FiVolume2,
} from 'react-icons/fi'
import Banner from '~/components/Banner'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Cells from '~/components/Cells'
import Checkbox from '~/components/Checkbox'
import Container from '~/components/Container'
import Emoji from '~/components/Emoji'
import Header from '~/components/Header'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import LastNumbers from '~/components/LastNumbers'
import Loading from '~/components/Loading'
import Message from '~/components/Message'
import RoomCodeCell from '~/components/RoomCodeCell'
import RoundedButton from '~/components/RoundedButton'
import Select from '~/components/Select'
import SelectedNumbers from '~/components/SelectedNumbers'
import { COLORS } from '~/components/EmptyCell'
import { TicketNumbers } from '~/interfaces/custom/Ticket'
import { getBackgroundCellImageUrl } from '~/utils/backgroundCell'
import { BACKGROUND_CELL_VALUES, CODES, SOUNDS_EXTRAS } from '~/utils/constants'

const DEMO_TICKET: TicketNumbers = [
  7,
  10,
  null,
  31,
  null,
  55,
  65,
  null,
  null,
  8,
  null,
  22,
  36,
  null,
  null,
  68,
  null,
  90,
  null,
  17,
  26,
  null,
  48,
  59,
  null,
  71,
  null,
]

const CALLED_NUMBERS = [47, 12, 89, 31, 7, 65, 22]
const MARKED_NUMBERS = [7, 22, 31, 47]

const LANGUAGE_ICONS: { [key: string]: ReactNode } = {
  ar: <Emoji name="flag-ar" />,
  en: <Emoji name="us" />,
  world: <Emoji name="earth_americas" />,
}

const SECTION_LINKS = [
  { id: 'inicio-y-preparacion', label: 'Inicio y preparación' },
  { id: 'mesa-de-juego', label: 'Mesa de juego' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'componentes', label: 'Componentes y estados' },
]

function Section({
  children,
  description,
  id,
  title,
}: {
  children: ReactNode
  description: string
  id: string
  title: string
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-12" id={id}>
      <div className="mb-4">
        <Heading type="h2">
          <span id={`${id}-title`}>{title}</span>
        </Heading>
        <p className="mt-1 text-gray-700">{description}</p>
      </div>
      {children}
    </section>
  )
}

function StaticPlayerList() {
  const players = [
    { name: 'Cristhian', host: true },
    { name: 'Maru', host: false },
    { name: 'Tomi', host: false },
  ]

  return (
    <div className="border-gray-300 border-t-2 mt-4 -mx-4">
      {players.map((player, index) => (
        <div
          className={classnames([
            'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
            player.host
              ? 'bg-green-100'
              : index % 2 === 0
              ? 'bg-gray-100'
              : 'bg-gray-200',
          ])}
          key={player.name}
        >
          <div className="flex flex-auto items-center min-w-0">
            <p className="truncate">{player.name}</p>
            {player.host && (
              <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                Dirige el juego
              </span>
            )}
          </div>
          <div className="ml-4">
            <Button
              aria-label={`Eliminar a ${player.name}`}
              color="red"
              iconLeft={<FiTrash2 />}
              id={`demo-remove-player-${index}`}
              onClick={() => void 0}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function StaticTicket() {
  return (
    <Box>
      <p className="font-semibold uppercase">Cartón Nº 1</p>
      <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
        <Cells
          onSelectNumber={() => void 0}
          selectedNumbers={MARKED_NUMBERS}
          ticketNumbers={DEMO_TICKET}
        />
      </div>
    </Box>
  )
}

function StaticOptionButtons() {
  const buttons = [
    {
      bg: 'bg-yellow-300',
      color: 'text-yellow-800',
      Icon: FiSettings,
      label: 'Fondos',
    },
    {
      bg: 'bg-green-300',
      color: 'text-green-800',
      Icon: FiSmile,
      label: 'Festejos',
    },
    {
      bg: 'bg-green-300',
      color: 'text-green-800',
      Icon: FiVolume2,
      label: 'Sonidos',
    },
    {
      bg: 'bg-red-300',
      color: 'text-red-800',
      Icon: FiRotateCcw,
      label: 'Reiniciar',
    },
  ]

  return (
    <div className="flex flex-wrap justify-center items-start -mx-2">
      {buttons.map(({ bg, color, Icon, label }) => (
        <div className="mx-2 text-center" key={label}>
          <button
            aria-label={label}
            className={classnames([
              'block h-12 mx-auto outline-none rounded-full shadow w-12',
              'focus:outline-none focus:shadow-outline',
              'duration-150 ease-in-out transition',
              bg,
            ])}
            onClick={() => void 0}
            type="button"
          >
            <Icon className={classnames(['m-auto text-2xl', color])} />
          </button>
          <p className="mt-2 text-xs text-gray-700">{label}</p>
        </div>
      ))}
    </div>
  )
}

function StaticSoundList() {
  return (
    <div className="border-gray-300 border-t-2 -mx-4">
      {SOUNDS_EXTRAS.map(({ language, name }, index) => (
        <div
          className={classnames([
            'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
            index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200',
            index === 1 && 'bg-yellow-200',
          ])}
          key={name}
        >
          <div className="mr-4">
            <Button
              aria-label={`Reproducir ${name}`}
              disabled={index === 1}
              iconLeft={<FiPlayCircle />}
              id={`demo-sound-${index}`}
              onClick={() => void 0}
            />
          </div>
          <p className="flex flex-auto items-center min-w-0">
            <span>{LANGUAGE_ICONS[language]}</span>
            <span className="ml-4 truncate">{name}</span>
          </p>
        </div>
      ))}
    </div>
  )
}

function BackgroundPreview() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
      {BACKGROUND_CELL_VALUES.map(({ key, type, value }, index) => {
        const firstValue = Array.isArray(value) ? value[0] : value
        return (
          <div className="bg-gray-100 border-2 border-gray-300" key={key}>
            <div
              className={classnames([
                'bg-center bg-contain bg-no-repeat h-20 w-full',
                type === 'color' && COLORS[firstValue],
              ])}
              style={{
                ...(type === 'img' && {
                  backgroundImage: `url(${getBackgroundCellImageUrl(
                    firstValue,
                  )})`,
                }),
              }}
            />
            <p className="border-t-2 border-gray-300 p-2 text-center text-sm">
              {t(key)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function KitchenSink() {
  return (
    <main className="bg-gray-200 flex flex-col min-h-screen">
      <Head>
        <title>Referencia visual | Coronabingo</title>
        <meta content="noindex,nofollow" name="robots" />
      </Head>

      <Banner type="emphasis">
        <span className="font-medium text-center">
          Demo estática de interfaz. No crea salas ni modifica partidas.
        </span>
      </Banner>
      <Header />

      <div className="flex-auto px-4 py-8">
        <Container size="large">
          <header>
            <Heading type="h1">Referencia visual de Coronabingo</Heading>
            <p className="mt-2 max-w-3xl text-gray-700">
              Una foto de la interfaz actual para revisar jerarquía, color,
              densidad y comportamiento responsive antes de rediseñar.
            </p>
            <nav aria-label="Secciones de la referencia" className="mt-6">
              <ul className="flex flex-wrap -mx-2">
                {SECTION_LINKS.map(({ id, label }) => (
                  <li className="mx-2 mb-2" key={id}>
                    <a
                      className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
                      href={`#${id}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <Section
            description="La entrada a la app y los controles usados para preparar una sala."
            id="inicio-y-preparacion"
            title="Inicio y preparación"
          >
            <div className="lg:flex lg:items-start lg:-mx-2">
              <div className="lg:px-2 lg:w-1/3">
                <Box>
                  <div className="mb-4">
                    <Heading textAlign="center" type="h2">
                      Crear una sala
                    </Heading>
                  </div>
                  <InputText
                    id="demo-room-name"
                    label="Nombre *"
                    onChange={() => void 0}
                    value="Bingo del domingo"
                  />
                  <div className="mt-8">
                    <Button
                      aria-label="Listo"
                      className="w-full"
                      color="green"
                      iconLeft={<FiSmile />}
                      id="demo-create-room"
                      onClick={() => void 0}
                    >
                      Listo
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Button
                      aria-label="Ver tutorial"
                      className="w-full"
                      iconLeft={<FiInfo />}
                      id="demo-tutorial"
                      onClick={() => void 0}
                    >
                      Ver tutorial
                    </Button>
                  </div>
                </Box>
              </div>

              <div className="mt-4 lg:mt-0 lg:px-2 lg:w-2/3">
                <Box>
                  <div className="mb-4">
                    <Heading textAlign="center" type="h2">
                      Preparar sala
                    </Heading>
                  </div>
                  <InputText
                    id="demo-setup-name"
                    label="Nombre"
                    readonly
                    value="Bingo del domingo"
                  />
                  <InputText
                    hint="Compartí este link a las personas de la videollamada."
                    id="demo-room-link"
                    label="Link a la sala"
                    readonly
                    value="coronabingo.com.ar/room/demo"
                  />
                  <Button
                    aria-label="Compartir link"
                    iconLeft={<FiShare2 />}
                    id="demo-share"
                    onClick={() => void 0}
                  >
                    Compartir link
                  </Button>

                  <div className="mt-8">
                    <p className="flex items-center">
                      <span className="mr-1">Personas que van a jugar:</span>
                      <span>3 de 18</span>
                    </p>
                    <div className="flex items-end">
                      <div className="flex-auto">
                        <InputText
                          id="demo-player-name"
                          label="Nombre *"
                          onChange={() => void 0}
                          value=""
                        />
                      </div>
                      <div className="mb-4 ml-4">
                        <Button
                          aria-label="Agregar persona"
                          color="green"
                          disabled
                          iconLeft={<FiPlus />}
                          id="demo-add-player"
                        />
                      </div>
                    </div>
                    <StaticPlayerList />
                  </div>

                  <div className="mt-4">
                    <Select
                      hint="Elegí la persona que se va a hacer cargo de marcar los números."
                      id="demo-host"
                      label="Dirige el juego"
                      onChange={() => void 0}
                      options={[
                        { id: 'cristhian', name: 'Cristhian' },
                        { id: 'maru', name: 'Maru' },
                        { id: 'tomi', name: 'Tomi' },
                      ]}
                      value="cristhian"
                    />
                  </div>
                  <div className="mt-4">
                    <Checkbox
                      hint="Si tenés un bolillero y querés usarlo no tildes esta opción."
                      id="demo-online-spinner"
                      label="Usar bolillero online"
                      onChange={() => void 0}
                      value
                    />
                  </div>
                  <div className="mt-4">
                    <Checkbox
                      hint="Útil para partidas fuera de Argentina."
                      id="demo-hide-meanings"
                      label="Ocultar los significados de los números"
                      onChange={() => void 0}
                      value={false}
                    />
                  </div>
                  <div className="mt-8">
                    <Button
                      aria-label="Jugar"
                      className="w-full"
                      color="green"
                      iconLeft={<FiSmile />}
                      id="demo-play"
                      onClick={() => void 0}
                    >
                      Jugar
                    </Button>
                  </div>
                </Box>
              </div>
            </div>
          </Section>

          <Section
            description="Una composición cercana a la pantalla real del juego, con números, bolillero, cartón y accesos rápidos."
            id="mesa-de-juego"
            title="Mesa de juego"
          >
            <div className="mb-4">
              <Heading textAlign="center" type="h2">
                Hola Cristhian, estás en la sala Bingo del domingo
              </Heading>
            </div>
            <div className="lg:flex lg:justify-center">
              <div className="lg:w-1/3">
                <Box>
                  <div className="mb-4">
                    <Heading textAlign="center" type="h2">
                      Últimos números
                    </Heading>
                  </div>
                  <LastNumbers
                    hideNumbersMeaning={false}
                    selectedNumbers={CALLED_NUMBERS}
                  />
                </Box>
                <div className="mt-4">
                  <Box>
                    <Heading textAlign="center" type="h2">
                      Bolillero
                    </Heading>
                    <div className="mt-4">
                      <SelectedNumbers
                        bingoSpinner
                        isAdmin
                        onNewNumber={() => void 0}
                        selectedNumbers={CALLED_NUMBERS}
                      />
                    </div>
                  </Box>
                </div>
                <div className="mt-4">
                  <StaticOptionButtons />
                </div>
              </div>
              <div className="pt-4 lg:pt-0 lg:pl-4 lg:w-2/3">
                <StaticTicket />
                <div className="mt-4">
                  <Message type="information">
                    Los controles de esta página son sólo una referencia visual.
                  </Message>
                </div>
              </div>
            </div>
          </Section>

          <Section
            description="El contenido que hoy aparece dentro de modales, desplegado para poder compararlo en una sola vista."
            id="herramientas"
            title="Herramientas del juego"
          >
            <div className="lg:flex lg:items-start lg:-mx-2">
              <div className="lg:px-2 lg:w-1/2">
                <Box>
                  <div className="mb-4">
                    <Heading type="h2">Sonidos</Heading>
                  </div>
                  <StaticSoundList />
                </Box>
              </div>
              <div className="mt-4 lg:mt-0 lg:px-2 lg:w-1/2">
                <Box>
                  <Heading type="h2">Fondos de celdas vacías</Heading>
                  <BackgroundPreview />
                  <InputText
                    id="demo-background-url"
                    label="O bien, pegá el link a una imagen en internet"
                    onChange={() => void 0}
                    value=""
                  />
                </Box>
                <div className="mt-4">
                  <Box>
                    <Heading type="h2">Código de acceso</Heading>
                    <p className="mt-2 text-gray-700">
                      Elegí tres figuras para ingresar a los cartones del
                      anfitrión.
                    </p>
                    <div className="flex flex-wrap justify-between mt-4">
                      {CODES.map((emoji, index) => (
                        <RoomCodeCell
                          emoji={emoji}
                          index={index}
                          isChecked={[0, 3, 7].includes(index)}
                          key={emoji}
                          onClick={() => void 0}
                        />
                      ))}
                    </div>
                  </Box>
                </div>
                <div className="mt-4">
                  <Box>
                    <Heading type="h2">Festejos y reinicio</Heading>
                    <div className="mt-4">
                      <Button
                        aria-label="Activar confetti"
                        className="w-full"
                        color="green"
                        iconLeft={<FiSmile />}
                        id="demo-confetti-on"
                        onClick={() => void 0}
                      >
                        Activar confetti
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button
                        aria-label="Desactivar globos"
                        className="w-full"
                        color="red"
                        iconLeft={<FiFrown />}
                        id="demo-balloons-off"
                        onClick={() => void 0}
                      >
                        Desactivar globos
                      </Button>
                    </div>
                    <div className="border-t-2 border-gray-200 mt-6 pt-6">
                      <p>
                        Volvé a preparar la sala, cambiá roles y redistribuí los
                        cartones para una partida nueva.
                      </p>
                      <div className="mt-4 text-center">
                        <Button
                          aria-label="Reiniciar partida"
                          color="green"
                          iconLeft={<FiRotateCcw />}
                          id="demo-restart-game"
                          onClick={() => void 0}
                        >
                          Reiniciar partida
                        </Button>
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
            </div>
          </Section>

          <Section
            description="Tipografía, acciones, campos y mensajes en sus variantes actuales."
            id="componentes"
            title="Componentes y estados"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Box>
                <Heading type="h2">Títulos y texto</Heading>
                <div className="mt-6">
                  <Heading type="h1">Título principal</Heading>
                </div>
                <div className="mt-4">
                  <Heading type="h2">Título de sección</Heading>
                </div>
                <p className="mt-4">
                  Texto de cuerpo para explicar una acción o dar contexto.
                </p>
                <p className="italic mt-2 text-gray-800 text-xs md:text-sm">
                  Texto de ayuda para campos y decisiones secundarias.
                </p>
                <a
                  className="focus:outline-none focus:shadow-outline font-medium mt-4 text-blue-800 underline inline-block"
                  href="#componentes"
                >
                  Enlace de ejemplo
                </a>
              </Box>

              <Box>
                <Heading type="h2">Botones</Heading>
                <div className="flex flex-wrap items-center mt-4 -mx-2">
                  <div className="m-2">
                    <Button
                      aria-label="Confirmar"
                      color="green"
                      iconLeft={<FiCheck />}
                      id="demo-button-green"
                      onClick={() => void 0}
                    >
                      Confirmar
                    </Button>
                  </div>
                  <div className="m-2">
                    <Button
                      aria-label="Acción secundaria"
                      iconLeft={<FiSettings />}
                      id="demo-button-yellow"
                      onClick={() => void 0}
                    >
                      Configurar
                    </Button>
                  </div>
                  <div className="m-2">
                    <Button
                      aria-label="Eliminar"
                      color="red"
                      iconLeft={<FiTrash2 />}
                      id="demo-button-red"
                      onClick={() => void 0}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <div className="m-2">
                    <Button
                      aria-label="Deshabilitado"
                      disabled
                      iconLeft={<FiRefreshCw />}
                      id="demo-button-disabled"
                    >
                      Deshabilitado
                    </Button>
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 flex flex-wrap justify-center mt-4 pt-4">
                  <RoundedButton
                    Icon={FiCopy}
                    iconBgColor="bg-gray-500"
                    id="demo-rounded-copy"
                    label="Copiar"
                    onClick={() => void 0}
                  />
                  <RoundedButton
                    Icon={FiShare2}
                    iconBgColor="bg-telegram"
                    id="demo-rounded-share"
                    label="Compartir"
                    onClick={() => void 0}
                  />
                </div>
              </Box>

              <Box>
                <Heading type="h2">Campos</Heading>
                <InputText
                  hint="Texto de ayuda opcional."
                  id="demo-default-input"
                  label="Campo de texto"
                  onChange={() => void 0}
                  value="Contenido de ejemplo"
                />
                <InputText
                  id="demo-readonly-input"
                  label="Campo de sólo lectura"
                  readonly
                  value="coronabingo.com.ar/room/demo"
                />
                <Select
                  id="demo-select"
                  label="Selector"
                  onChange={() => void 0}
                  options={[
                    { id: 'one', name: 'Primera opción' },
                    { id: 'two', name: 'Segunda opción' },
                  ]}
                  value="one"
                />
                <div className="mt-4">
                  <Checkbox
                    id="demo-checkbox"
                    label="Opción activada"
                    onChange={() => void 0}
                    value
                  />
                </div>
              </Box>

              <Box>
                <Heading type="h2">Mensajes y carga</Heading>
                <div className="mt-4">
                  <Message type="success">
                    La sala se guardó correctamente.
                  </Message>
                </div>
                <div className="mt-3">
                  <Message type="information">
                    La sala todavía se está configurando.
                  </Message>
                </div>
                <div className="mt-3">
                  <Message type="error">
                    No pudimos guardar los cambios.
                  </Message>
                </div>
                <div className="border-t-2 border-gray-200 mt-6 pt-6">
                  <Loading message="Cargando partida..." />
                </div>
              </Box>
            </div>

            <div className="mt-4">
              <Box>
                <Heading type="h2">Banners</Heading>
                <div className="mt-4 -mx-4">
                  <Banner>Información general</Banner>
                  <Banner type="emphasis">Entorno de prueba</Banner>
                  <Banner type="error">Hay un problema con la sala</Banner>
                </div>
              </Box>
            </div>
          </Section>
        </Container>
      </div>

      <footer className="bg-white p-4 shadow">
        <Container size="large">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-center md:text-left">
              Referencia local de Coronabingo
            </p>
            <p className="mt-2 text-center text-gray-700 md:mt-0 md:text-right">
              Escenas estáticas, sin conexión con una sala
            </p>
          </div>
        </Container>
      </footer>
    </main>
  )
}

export default KitchenSink
