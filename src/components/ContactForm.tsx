import { createSignal } from "solid-js";

export default function ContactForm() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    alert(`Message envoyé ✅\n${name()} - ${email()} : ${message()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Votre nom"
        value={name()}
        onInput={e => setName(e.currentTarget.value)}
        required />
        
      <input
        type="email"
        placeholder="Votre email"
        value={email()}
        onInput={e => setEmail(e.currentTarget.value)}
        required />

      <textarea
        placeholder="Votre message"
        value={message()}
        onInput={e => setMessage(e.currentTarget.value)}
        required />

      <button type="submit">
        Envoyer
      </button>
    </form>
  );
}