// Static imports let webpack publish each graphic under a content hash.
import { Emojis } from '~/interfaces/custom/Emojis'
import emoji_8ball from '~/assets/emojis/8ball.svg'
import emoji_airplane from '~/assets/emojis/airplane.svg'
import emoji_ambulance from '~/assets/emojis/ambulance.svg'
import emoji_angel from '~/assets/emojis/angel.svg'
import emoji_athletic_shoe from '~/assets/emojis/athletic_shoe.svg'
import emoji_baguette_bread from '~/assets/emojis/baguette_bread.svg'
import emoji_banana from '~/assets/emojis/banana.svg'
import emoji_basketball from '~/assets/emojis/basketball.svg'
import emoji_bed from '~/assets/emojis/bed.svg'
import emoji_beers from '~/assets/emojis/beers.svg'
import emoji_bird from '~/assets/emojis/bird.svg'
import emoji_bouquet from '~/assets/emojis/bouquet.svg'
import emoji_bow_and_arrow from '~/assets/emojis/bow_and_arrow.svg'
import emoji_boxing_glove from '~/assets/emojis/boxing_glove.svg'
import emoji_boy from '~/assets/emojis/boy.svg'
import emoji_bread from '~/assets/emojis/bread.svg'
import emoji_bug from '~/assets/emojis/bug.svg'
import emoji_bulb from '~/assets/emojis/bulb.svg'
import emoji_butterfly from '~/assets/emojis/butterfly.svg'
import emoji_cactus from '~/assets/emojis/cactus.svg'
import emoji_cat from '~/assets/emojis/cat.svg'
import emoji_chains from '~/assets/emojis/chains.svg'
import emoji_chicken from '~/assets/emojis/chicken.svg'
import emoji_chopsticks from '~/assets/emojis/chopsticks.svg'
import emoji_church from '~/assets/emojis/church.svg'
import emoji_cloud from '~/assets/emojis/cloud.svg'
import emoji_clown_face from '~/assets/emojis/clown_face.svg'
import emoji_coffee from '~/assets/emojis/coffee.svg'
import emoji_cold_face from '~/assets/emojis/cold_face.svg'
import emoji_couple_with_heart from '~/assets/emojis/couple_with_heart.svg'
import emoji_cow from '~/assets/emojis/cow.svg'
import emoji_cut_of_meat from '~/assets/emojis/cut_of_meat.svg'
import emoji_deciduous_tree from '~/assets/emojis/deciduous_tree.svg'
import emoji_dog from '~/assets/emojis/dog.svg'
import emoji_dromedary_camel from '~/assets/emojis/dromedary_camel.svg'
import emoji_earth_americas from '~/assets/emojis/earth_americas.svg'
import emoji_es from '~/assets/emojis/es.svg'
import emoji_exploding_head from '~/assets/emojis/exploding_head.svg'
import emoji_female_zombie from '~/assets/emojis/female_zombie.svg'
import emoji_fire from '~/assets/emojis/fire.svg'
import emoji_fish from '~/assets/emojis/fish.svg'
import emoji_flag_ar from '~/assets/emojis/flag-ar.svg'
import emoji_flashlight from '~/assets/emojis/flashlight.svg'
import emoji_frame_with_picture from '~/assets/emojis/frame_with_picture.svg'
import emoji_game_die from '~/assets/emojis/game_die.svg'
import emoji_gift from '~/assets/emojis/gift.svg'
import emoji_girl from '~/assets/emojis/girl.svg'
import emoji_glass_of_milk from '~/assets/emojis/glass_of_milk.svg'
import emoji_guitar from '~/assets/emojis/guitar.svg'
import emoji_gun from '~/assets/emojis/gun.svg'
import emoji_hankey from '~/assets/emojis/hankey.svg'
import emoji_hocho from '~/assets/emojis/hocho.svg'
import emoji_hole from '~/assets/emojis/hole.svg'
import emoji_horse from '~/assets/emojis/horse.svg'
import emoji_hospital from '~/assets/emojis/hospital.svg'
import emoji_leg from '~/assets/emojis/leg.svg'
import emoji_lips from '~/assets/emojis/lips.svg'
import emoji_llama from '~/assets/emojis/llama.svg'
import emoji_male_guard from '~/assets/emojis/male-guard.svg'
import emoji_male_zombie from '~/assets/emojis/male_zombie.svg'
import emoji_man_boy from '~/assets/emojis/man-boy.svg'
import emoji_man_facepalming from '~/assets/emojis/man-facepalming.svg'
import emoji_man_getting_haircut from '~/assets/emojis/man-getting-haircut.svg'
import emoji_moneybag from '~/assets/emojis/moneybag.svg'
import emoji_mountain from '~/assets/emojis/mountain.svg'
import emoji_ocean from '~/assets/emojis/ocean.svg'
import emoji_oil_drum from '~/assets/emojis/oil_drum.svg'
import emoji_partying_face from '~/assets/emojis/partying_face.svg'
import emoji_pill from '~/assets/emojis/pill.svg'
import emoji_potato from '~/assets/emojis/potato.svg'
import emoji_pray from '~/assets/emojis/pray.svg'
import emoji_pregnant_woman from '~/assets/emojis/pregnant_woman.svg'
import emoji_rain_cloud from '~/assets/emojis/rain_cloud.svg'
import emoji_rainbow from '~/assets/emojis/rainbow.svg'
import emoji_rat from '~/assets/emojis/rat.svg'
import emoji_ring from '~/assets/emojis/ring.svg'
import emoji_scream from '~/assets/emojis/scream.svg'
import emoji_ship from '~/assets/emojis/ship.svg'
import emoji_smirk from '~/assets/emojis/smirk.svg'
import emoji_snail from '~/assets/emojis/snail.svg'
import emoji_snake from '~/assets/emojis/snake.svg'
import emoji_sob from '~/assets/emojis/sob.svg'
import emoji_soccer from '~/assets/emojis/soccer.svg'
import emoji_sweat_drops from '~/assets/emojis/sweat_drops.svg'
import emoji_syringe from '~/assets/emojis/syringe.svg'
import emoji_thunder_cloud_and_rain from '~/assets/emojis/thunder_cloud_and_rain.svg'
import emoji_tomato from '~/assets/emojis/tomato.svg'
import emoji_toolbox from '~/assets/emojis/toolbox.svg'
import emoji_tooth from '~/assets/emojis/tooth.svg'
import emoji_tornado from '~/assets/emojis/tornado.svg'
import emoji_us from '~/assets/emojis/us.svg'
import emoji_volcano from '~/assets/emojis/volcano.svg'
import emoji_wind_blowing_face from '~/assets/emojis/wind_blowing_face.svg'
import emoji_wine_glass from '~/assets/emojis/wine_glass.svg'
import emoji_woman from '~/assets/emojis/woman.svg'
import emoji_x from '~/assets/emojis/x.svg'
import emoji_zombie from '~/assets/emojis/zombie.svg'

const emojiGraphics: Record<keyof Emojis, string> = {
  '8ball': emoji_8ball,
  airplane: emoji_airplane,
  ambulance: emoji_ambulance,
  angel: emoji_angel,
  athletic_shoe: emoji_athletic_shoe,
  baguette_bread: emoji_baguette_bread,
  banana: emoji_banana,
  basketball: emoji_basketball,
  bed: emoji_bed,
  beers: emoji_beers,
  bird: emoji_bird,
  bouquet: emoji_bouquet,
  bow_and_arrow: emoji_bow_and_arrow,
  boxing_glove: emoji_boxing_glove,
  boy: emoji_boy,
  bread: emoji_bread,
  bug: emoji_bug,
  bulb: emoji_bulb,
  butterfly: emoji_butterfly,
  cactus: emoji_cactus,
  cat: emoji_cat,
  chains: emoji_chains,
  chicken: emoji_chicken,
  chopsticks: emoji_chopsticks,
  church: emoji_church,
  cloud: emoji_cloud,
  clown_face: emoji_clown_face,
  coffee: emoji_coffee,
  cold_face: emoji_cold_face,
  couple_with_heart: emoji_couple_with_heart,
  cow: emoji_cow,
  cut_of_meat: emoji_cut_of_meat,
  deciduous_tree: emoji_deciduous_tree,
  dog: emoji_dog,
  dromedary_camel: emoji_dromedary_camel,
  earth_americas: emoji_earth_americas,
  es: emoji_es,
  exploding_head: emoji_exploding_head,
  female_zombie: emoji_female_zombie,
  fire: emoji_fire,
  fish: emoji_fish,
  'flag-ar': emoji_flag_ar,
  flashlight: emoji_flashlight,
  frame_with_picture: emoji_frame_with_picture,
  game_die: emoji_game_die,
  gift: emoji_gift,
  girl: emoji_girl,
  glass_of_milk: emoji_glass_of_milk,
  guitar: emoji_guitar,
  gun: emoji_gun,
  hankey: emoji_hankey,
  hocho: emoji_hocho,
  hole: emoji_hole,
  horse: emoji_horse,
  hospital: emoji_hospital,
  leg: emoji_leg,
  lips: emoji_lips,
  llama: emoji_llama,
  'male-guard': emoji_male_guard,
  male_zombie: emoji_male_zombie,
  'man-boy': emoji_man_boy,
  'man-facepalming': emoji_man_facepalming,
  'man-getting-haircut': emoji_man_getting_haircut,
  moneybag: emoji_moneybag,
  mountain: emoji_mountain,
  ocean: emoji_ocean,
  oil_drum: emoji_oil_drum,
  partying_face: emoji_partying_face,
  pill: emoji_pill,
  potato: emoji_potato,
  pray: emoji_pray,
  pregnant_woman: emoji_pregnant_woman,
  rain_cloud: emoji_rain_cloud,
  rainbow: emoji_rainbow,
  rat: emoji_rat,
  ring: emoji_ring,
  scream: emoji_scream,
  ship: emoji_ship,
  smirk: emoji_smirk,
  snail: emoji_snail,
  snake: emoji_snake,
  sob: emoji_sob,
  soccer: emoji_soccer,
  sweat_drops: emoji_sweat_drops,
  syringe: emoji_syringe,
  thunder_cloud_and_rain: emoji_thunder_cloud_and_rain,
  tomato: emoji_tomato,
  toolbox: emoji_toolbox,
  tooth: emoji_tooth,
  tornado: emoji_tornado,
  us: emoji_us,
  volcano: emoji_volcano,
  wind_blowing_face: emoji_wind_blowing_face,
  wine_glass: emoji_wine_glass,
  woman: emoji_woman,
  x: emoji_x,
  zombie: emoji_zombie,
}

export default emojiGraphics
