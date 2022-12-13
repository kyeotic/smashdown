import type { Fighter, Player, Tournament, TournamentPlayer } from './types'
import { filter } from 'lodash'

export const Random = {
  icon: 'random.png',
}

export const banjo: Fighter = {
  id: 'banjo',
  name: 'Banjo & Kazooie',
  isMii: false,
  icon: 'banjo.png',
}

export const bayonetta: Fighter = {
  id: 'bayonetta',
  name: 'Bayonetta',
  isMii: false,
  icon: 'bayonetta.png',
}

export const bowser: Fighter = {
  id: 'bowser',
  name: 'Bowser',
  isMii: false,
  icon: 'bowser.png',
}

export const bowserJr: Fighter = {
  id: 'bowserJr',
  name: 'Bowser Jr.',
  isMii: false,
  icon: 'bowser-jr.png',
}

export const byleth: Fighter = {
  id: 'byleth',
  name: 'Byleth',
  isMii: false,
  icon: 'byleth.png',
}

export const captainFalcon: Fighter = {
  id: 'captainFalcon',
  name: 'Captain Falcon',
  isMii: false,
  icon: 'captain-falcon.png',
}

export const chrom: Fighter = {
  id: 'chrom',
  name: 'Chrom',
  isMii: false,
  icon: 'chrom.png',
}

export const cloud: Fighter = {
  id: 'cloud',
  name: 'Cloud',
  isMii: false,
  icon: 'cloud.png',
}

export const corrin: Fighter = {
  id: 'corrin',
  name: 'Corrin',
  isMii: false,
  icon: 'corrin.png',
}

export const daisy: Fighter = {
  id: 'daisy',
  name: 'Daisy',
  isMii: false,
  icon: 'daisy.png',
}

export const darkPit: Fighter = {
  id: 'darkPit',
  name: 'Dark Pit',
  isMii: false,
  icon: 'dark-pit.png',
}

export const darkSamus: Fighter = {
  id: 'darkSamus',
  name: 'Dark Samus',
  isMii: false,
  icon: 'dark-samus.png',
}

export const diddyKong: Fighter = {
  id: 'diddyKong',
  name: 'Diddy Kong',
  isMii: false,
  icon: 'diddy-kong.png',
}

export const donkeyKong: Fighter = {
  id: 'donkeyKong',
  name: 'Donkey Kong',
  isMii: false,
  icon: 'donkey-kong.png',
}

export const drMario: Fighter = {
  id: 'drMario',
  name: 'Dr. Mario',
  isMii: false,
  icon: 'dr-mario.png',
}

export const duckHunt: Fighter = {
  id: 'duckHunt',
  name: 'Duck Hunt',
  isMii: false,
  icon: 'duck-hunt.png',
}

export const falco: Fighter = {
  id: 'falco',
  name: 'Falco',
  isMii: false,
  icon: 'falco.png',
}

export const fox: Fighter = {
  id: 'fox',
  name: 'Fox',
  isMii: false,
  icon: 'fox.png',
}

export const ganondorf: Fighter = {
  id: 'ganondorf',
  name: 'Ganondorf',
  isMii: false,
  icon: 'ganondorf.png',
}

export const greninja: Fighter = {
  id: 'greninja',
  name: 'Greninja',
  isMii: false,
  icon: 'greninja.png',
}

export const hero: Fighter = {
  id: 'hero',
  name: 'Hero',
  isMii: false,
  icon: 'hero.png',
}

export const iceClimbers: Fighter = {
  id: 'iceClimbers',
  name: 'Ice Climbers',
  isMii: false,
  icon: 'ice-climbers.png',
}

export const ike: Fighter = {
  id: 'ike',
  name: 'Ike',
  isMii: false,
  icon: 'ike.png',
}

export const incineroar: Fighter = {
  id: 'incineroar',
  name: 'Incineroar',
  isMii: false,
  icon: 'incineroar.png',
}

export const inkling: Fighter = {
  id: 'inkling',
  name: 'Inkling',
  isMii: false,
  icon: 'inkling.png',
}

export const isabelle: Fighter = {
  id: 'isabelle',
  name: 'Isabelle',
  isMii: false,
  icon: 'isabelle.png',
}

export const jigglypuff: Fighter = {
  id: 'jigglypuff',
  name: 'Jigglypuff',
  isMii: false,
  icon: 'jigglypuff.png',
}

export const joker: Fighter = {
  id: 'joker',
  name: 'Joker',
  isMii: false,
  icon: 'joker.png',
}

export const kazuya: Fighter = {
  id: 'kazuya',
  name: 'Kazuya',
  isMii: false,
  icon: 'kazuya.png',
}

export const ken: Fighter = {
  id: 'ken',
  name: 'Ken',
  isMii: false,
  icon: 'ken.png',
}

export const kingDedede: Fighter = {
  id: 'kingDedede',
  name: 'King Dedede',
  isMii: false,
  icon: 'king-dedede.png',
}

export const kingKRool: Fighter = {
  id: 'kingKRool',
  name: 'King K. Rool',
  isMii: false,
  icon: 'king-k-rool.png',
}

export const kirby: Fighter = {
  id: 'kirby',
  name: 'Kirby',
  isMii: false,
  icon: 'kirby.png',
}

export const adultLink: Fighter = {
  id: 'link',
  name: 'Link',
  isMii: false,
  icon: 'link.png',
}

export const littleMac: Fighter = {
  id: 'littleMac',
  name: 'Little Mac',
  isMii: false,
  icon: 'little-mac.png',
}

export const lucario: Fighter = {
  id: 'lucario',
  name: 'Lucario',
  isMii: false,
  icon: 'lucario.png',
}

export const lucas: Fighter = {
  id: 'lucas',
  name: 'Lucas',
  isMii: false,
  icon: 'lucas.png',
}

export const lucina: Fighter = {
  id: 'lucina',
  name: 'Lucina',
  isMii: false,
  icon: 'lucina.png',
}

export const luigi: Fighter = {
  id: 'luigi',
  name: 'Luigi',
  isMii: false,
  icon: 'luigi.png',
}

export const mario: Fighter = {
  id: 'mario',
  name: 'Mario',
  isMii: false,
  icon: 'mario.png',
}

export const marth: Fighter = {
  id: 'marth',
  name: 'Marth',
  isMii: false,
  icon: 'marth.png',
}

export const megaMan: Fighter = {
  id: 'megaMan',
  name: 'Mega Man',
  isMii: false,
  icon: 'mega-man.png',
}

export const metaKnight: Fighter = {
  id: 'metaKnight',
  name: 'Meta Knight',
  isMii: false,
  icon: 'meta-knight.png',
}

export const mewtwo: Fighter = {
  id: 'mewtwo',
  name: 'Mewtwo',
  isMii: false,
  icon: 'mewtwo.png',
}

export const minMin: Fighter = {
  id: 'minMin',
  name: 'Min Min',
  isMii: false,
  icon: 'min-min.png',
}

export const mrGameWatch: Fighter = {
  id: 'mrGameWatch',
  name: 'Mr.\xa0Game & Watch',
  isMii: false,
  icon: 'mr-game-and-watch.png',
}

export const ness: Fighter = {
  id: 'ness',
  name: 'Ness',
  isMii: false,
  icon: 'ness.png',
}

export const olimar: Fighter = {
  id: 'olimar',
  name: 'Olimar',
  isMii: false,
  icon: 'olimar.png',
}

export const pacMan: Fighter = {
  id: 'pacMan',
  name: 'Pac\u2011Man',
  isMii: false,
  icon: 'pac-man.png',
}

export const palutena: Fighter = {
  id: 'palutena',
  name: 'Palutena',
  isMii: false,
  icon: 'palutena.png',
}

export const peach: Fighter = {
  id: 'peach',
  name: 'Peach',
  isMii: false,
  icon: 'peach.png',
}

export const pichu: Fighter = {
  id: 'pichu',
  name: 'Pichu',
  isMii: false,
  icon: 'pichu.png',
}

export const pikachu: Fighter = {
  id: 'pikachu',
  name: 'Pikachu',
  isMii: false,
  icon: 'pikachu.png',
}

export const piranhaPlant: Fighter = {
  id: 'piranhaPlant',
  name: 'Piranha Plant',
  isMii: false,
  icon: 'piranha-plant.png',
}

export const pit: Fighter = {
  id: 'pit',
  name: 'Pit',
  isMii: false,
  icon: 'pit.png',
}

export const pokemonTrainer: Fighter = {
  id: 'pokemonTrainer',
  name: 'Pokémon Trainer',
  isMii: false,
  icon: 'pokemon-trainer.png',
}

export const pyraMythra: Fighter = {
  id: 'pyraMythra',
  name: 'Pyra / Mythra',
  isMii: false,
  icon: 'pyra-mythra.png',
}

export const rob: Fighter = {
  id: 'rob',
  name: 'R.O.B.',
  isMii: false,
  icon: 'rob.png',
}

export const richter: Fighter = {
  id: 'richter',
  name: 'Richter',
  isMii: false,
  icon: 'richter.png',
}

export const ridley: Fighter = {
  id: 'ridley',
  name: 'Ridley',
  isMii: false,
  icon: 'ridley.png',
}

export const robin: Fighter = {
  id: 'robin',
  name: 'Robin',
  isMii: false,
  icon: 'robin.png',
}

export const rosalina: Fighter = {
  id: 'rosalina',
  name: 'Rosalina & Luma',
  isMii: false,
  icon: 'rosalina.png',
}

export const roy: Fighter = {
  id: 'roy',
  name: 'Roy',
  isMii: false,
  icon: 'roy.png',
}

export const ryu: Fighter = {
  id: 'ryu',
  name: 'Ryu',
  isMii: false,
  icon: 'ryu.png',
}

export const samus: Fighter = {
  id: 'samus',
  name: 'Samus',
  isMii: false,
  icon: 'samus.png',
}

export const sephiroth: Fighter = {
  id: 'sephiroth',
  name: 'Sephiroth',
  isMii: false,
  icon: 'sephiroth.png',
}

export const sheik: Fighter = {
  id: 'sheik',
  name: 'Sheik',
  isMii: false,
  icon: 'sheik.png',
}

export const shulk: Fighter = {
  id: 'shulk',
  name: 'Shulk',
  isMii: false,
  icon: 'shulk.png',
}

export const simon: Fighter = {
  id: 'simon',
  name: 'Simon',
  isMii: false,
  icon: 'simon.png',
}

export const snake: Fighter = {
  id: 'snake',
  name: 'Snake',
  isMii: false,
  icon: 'snake.png',
}

export const sonic: Fighter = {
  id: 'sonic',
  name: 'Sonic',
  isMii: false,
  icon: 'sonic.png',
}

export const sora: Fighter = {
  id: 'sora',
  name: 'Sora',
  isMii: false,
  icon: 'sora.png',
}

export const steve: Fighter = {
  id: 'steve',
  name: 'Steve',
  isMii: false,
  icon: 'steve.png',
}

export const terry: Fighter = {
  id: 'terry',
  name: 'Terry',
  isMii: false,
  icon: 'terry.png',
}

export const toonLink: Fighter = {
  id: 'toonLink',
  name: 'Toon Link',
  isMii: false,
  icon: 'toon-link.png',
}

export const villager: Fighter = {
  id: 'villager',
  name: 'Villager',
  isMii: false,
  icon: 'villager.png',
}

export const wario: Fighter = {
  id: 'wario',
  name: 'Wario',
  isMii: false,
  icon: 'wario.png',
}

export const wiiFitTrainer: Fighter = {
  id: 'wiiFitTrainer',
  name: 'Wii Fit Trainer',
  isMii: false,
  icon: 'wii-fit-trainer.png',
}

export const wolf: Fighter = {
  id: 'wolf',
  name: 'Wolf',
  isMii: false,
  icon: 'wolf.png',
}

export const yoshi: Fighter = {
  id: 'yoshi',
  name: 'Yoshi',
  isMii: false,
  icon: 'yoshi.png',
}

export const youngLink: Fighter = {
  id: 'youngLink',
  name: 'Young Link',
  isMii: false,
  icon: 'young-link.png',
}

export const zelda: Fighter = {
  id: 'zelda',
  name: 'Zelda',
  isMii: false,
  icon: 'zelda.png',
}

export const zeroSuitSamus: Fighter = {
  id: 'zeroSuitSamus',
  name: 'Zero\xa0Suit Samus',
  isMii: false,
  icon: 'zero-suit-samus.png',
}

export const fighters = [
  banjo,
  bayonetta,
  bowser,
  bowserJr,
  byleth,
  captainFalcon,
  chrom,
  cloud,
  corrin,
  daisy,
  darkPit,
  darkSamus,
  diddyKong,
  donkeyKong,
  drMario,
  duckHunt,
  falco,
  fox,
  ganondorf,
  greninja,
  hero,
  iceClimbers,
  ike,
  incineroar,
  inkling,
  isabelle,
  jigglypuff,
  joker,
  kazuya,
  ken,
  kingDedede,
  kingKRool,
  kirby,
  adultLink,
  littleMac,
  lucario,
  lucas,
  lucina,
  luigi,
  mario,
  marth,
  megaMan,
  metaKnight,
  mewtwo,
  minMin,
  mrGameWatch,
  ness,
  olimar,
  pacMan,
  palutena,
  peach,
  pichu,
  pikachu,
  piranhaPlant,
  pit,
  pokemonTrainer,
  pyraMythra,
  rob,
  richter,
  ridley,
  robin,
  rosalina,
  roy,
  ryu,
  samus,
  sephiroth,
  sheik,
  shulk,
  simon,
  snake,
  sonic,
  sora,
  steve,
  terry,
  toonLink,
  villager,
  wario,
  wiiFitTrainer,
  wolf,
  yoshi,
  youngLink,
  zelda,
  zeroSuitSamus,
]

export function getFighter(id: string): Fighter {
  const f = fighters.find((f) => f.id === id)
  if (!f) throw new Error(`Invalid figher ID: ${id}`)
  return f
}

export function getRandomFighter(denyList: Fighter[] = []): Fighter {
  const pool = filter(fighters, (f) => !denyList.some((_f) => _f.id === f.id))
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getLostRoster(
  player: TournamentPlayer,
  tournament: Tournament,
): Fighter[] {
  return filter(player.roster, (f) =>
    tournament.finishedRounds.some((r) => r.losers),
  )
}
