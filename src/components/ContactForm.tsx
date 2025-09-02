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
            <div class="grid grid--gap">
                <div class="grid__col grid__col--6">
                    <label>
                        <input
                            type="text"
                            placeholder="Benjamin CARADEUC"
                            value={name()}
                            onInput={e => setName(e.currentTarget.value)}
                            required />

                        <div class="label label--floating">
                            Votre nom
                        </div>
                    </label>
                </div>

                <div class="grid__col grid__col--6">
                    <label>
                        <input
                            type="email"
                            placeholder="ben@jam.in"
                            value={email()}
                            onInput={e => setEmail(e.currentTarget.value)}
                            required />
                        <div class="label label--floating">
                            Votre email
                        </div>
                    </label>
                </div>

                <div class="grid__col grid__col--12">
                    <label>
                        <textarea
                            placeholder="bla bla bla..."
                            value={message()}
                            onInput={e => setMessage(e.currentTarget.value)}
                            required />

                        <div class="label label--floating">
                            Votre message
                        </div>
                    </label>
                </div>
            </div>

            <hr />

            <button type="submit" artia-busy="true" class="btn btn--variant-primary">
                <span class="btn__icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="1em"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-send">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </span>
                Envoyer
            </button>
        </form>
    );
}
