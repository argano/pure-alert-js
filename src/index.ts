interface ModalContext {
    style: HTMLStyleElement;
    container: HTMLDivElement;
    body: HTMLDivElement;
    message: HTMLDivElement;
    buttons: HTMLDivElement;
}
function initBase(): ModalContext {
    const style = document.createElement("style");
    style.id = "pajs-style";
    const scrollY = window.scrollY;
    style.type = "text/css";
    style.innerText = `
.pajs-modal-open {
    top: ${scrollY}px;
    width: 100%;
    position: fixed;
}
.pajs-modal-container {
    position: fixed;
    z-index: 99999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(100, 100, 100, 0.3);
}
.pajs-modal-body {
    position: absolute;
    top: 10px;
    left: 50%;
    background-color: white;
    margin-top: 10px;
    max-width: 400px;
    width: 90%;
    border-radius: 5px;
    transform: translate(-50%, 0);
    padding: 10px;
}
.pajs-modal-message {
    color: #333;
    padding: 10px;
    font-size: 15px;
    white-space: pre-wrap;
}
.pajs-modal-buttons {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}
.pajs-modal-button {
    appearance: none;
    border: 0;
    border-radius: 5px;
    background-color: #4676D7;
    color: #fff;
    padding: 4px;
    font-size: 15px;
    vertical-align: top;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}
`;
    const head = document.getElementsByTagName("head").item(0);
    const existing = document.getElementById("pajs-style");
    if (!existing) {
        head?.appendChild(style);
    }
    document.documentElement.classList.add("pajs-modal-open");
    document.body.classList.add("pajs-modal-open");

    const container = document.createElement("div");
    container.classList.add("pajs-modal-container");

    const body = document.createElement("div");
    body.classList.add("pajs-modal-body");
    container.appendChild(body);

    const message = document.createElement("div");
    message.classList.add("pajs-modal-message");
    body.appendChild(message);

    const buttons = document.createElement("div");
    buttons.classList.add("pajs-modal-buttons");
    body.appendChild(buttons);

    document.body.appendChild(container);
    return {
        style,
        container,
        body,
        message,
        buttons
    };
}

function clearBase(context: ModalContext): void {
    document.documentElement.classList.remove("pajs-modal-open");
    document.body.classList.remove("pajs-modal-open");
    context.style.remove();
    context.container.remove();
}

function createButton(label: string): HTMLDivElement {
    const btn = document.createElement("div");
    btn.classList.add("pajs-modal-button");
    btn.innerText = label;
    return btn;
}

export async function alert(message: string): Promise<void> {
    const context = initBase();
    context.message.innerText = message;

    const okButton = createButton("OK");
    context.buttons.appendChild(okButton);

    await new Promise<void>(resolve => {
        okButton.addEventListener("click", () => {
            clearBase(context);
            resolve();
        });
    });
}

export async function confirm(message: string): Promise<boolean> {
    const context = initBase();
    context.message.innerText = message;
    const cancelButton = createButton("キャンセル");
    cancelButton.style.backgroundColor = "#666";
    context.buttons.appendChild(cancelButton);

    const okButton = createButton("OK");
    context.buttons.appendChild(okButton);

    return await new Promise<boolean>(resolve => {
        okButton.addEventListener("click", () => {
            clearBase(context);
            resolve(true);
        });
        cancelButton.addEventListener("click", () => {
            clearBase(context);
            resolve(false);
        });
    });
}
