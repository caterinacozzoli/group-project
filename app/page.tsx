import books from "@/data/books.json";
import promos from "@/data/promos.json";
import services from "@/data/services.json";
import user from "@/data/user.json";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";
import Chips from "@/components/Chips";
import CardProfilo from "@/components/CardProfilo";
import SectionHeader from "@/components/SectionHeader";
import Carousel from "@/components/Carousel";
import CardLibro from "@/components/CardLibro";
import CardServizio from "@/components/CardServizio";
import CardPromo from "@/components/CardPromo";
import MysteryBox from "@/components/MysteryBox";
import Footer from "@/components/Footer";
import Libby from "@/components/libby/Libby";
import styles from "./page.module.css";

const libri = new Map(books.libri.map((l) => [l.id, l]));

function Scaffale({ id }: { id: string }) {
  const s = books.scaffali.find((x) => x.id === id)!;
  return (
    <section className={styles.sezione} aria-labelledby={`h-${s.id}`}>
      <SectionHeader id={`h-${s.id}`} titolo={s.titolo} vediTutti={s.vediTutti} />
      <Carousel id={`lista-${s.id}`}>
        {s.libri.map((lid) => <CardLibro key={lid} libro={libri.get(lid)!} />)}
      </Carousel>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <div className={styles.pagina}>
        <StatusBar />
        <TabBar />
        <main id="main" className={styles.main}>
          <div className={styles.saluto}>
            <h1 className={styles.h1}>Bentornata {user.nome}!</h1>
            <Chips items={services.chips} />
          </div>

          <CardProfilo utente={user} />

          <section className={styles.sezione} aria-labelledby="h-da-qui">
            <SectionHeader id="h-da-qui" titolo="Da qui, tutto" />
            <Carousel id="lista-da-qui">
              {services.daQuiTutto.map((s) => <CardServizio key={s.id} s={s} />)}
            </Carousel>
          </section>

          <Scaffale id="scelti-per-te" />
          <Scaffale id="preferiti-in-sconto" />
          <Scaffale id="bestseller" />

          <section className={styles.sezione} aria-labelledby="h-mystery">
            <SectionHeader id="h-mystery" titolo={promos.mysteryBox.titoloSezione} />
            <MysteryBox box={promos.mysteryBox} />
          </section>

          <Scaffale id="ultime-uscite" />

          <section className={styles.sezione} aria-labelledby="h-offerte">
            <SectionHeader id="h-offerte" titolo="Offerte del momento" />
            <Carousel id="lista-offerte" gap={8}>
              {promos.offerte.map((p) => <CardPromo key={p.id} promo={p} />)}
            </Carousel>
          </section>

          <Scaffale id="outlet" />
          <Scaffale id="libri-usati" />
          <Scaffale id="libri-prenotabili" />
        </main>
        <Footer servizi={services.footer} />
      </div>
      <Libby />
    </>
  );
}
