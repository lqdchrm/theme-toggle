const { app, Menu, Tray, nativeImage } = require("electron");
const { registry } = require("windows");

try { require('electron-reloader')(module); } catch {}

const v = registry("HKCU/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize");

function light() { v.add('AppsUseLightTheme', 1); }
function dark() { v.add('AppsUseLightTheme', 0); }
function exit() { app.quit(); }

app.whenReady().then(() => {
    const singleInstance = app.requestSingleInstanceLock();

    if (!singleInstance) {
        app.quit();
    } else {
        const img = nativeImage.createFromDataURL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABOvAAATrwFj5o7DAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAyxJREFUWIXFl89vG0UUxz9vNnZy4VIVpWkDQlUjRWGdtaXk0N649ZYohyIORgLxS4gDN7iUS1QhcUNCiMKt5tJWihRu/AVwsGxP1rIEEYJD2qAqVIJDhDfafRw8DkvsdVyTVb4X7xvPzPfjp7eeN7K+vs55ypyrOzA1yaJOp3Px6OjosojMx3Gsnuftdbvdx6urq3/kBhCG4TVVrarqGhAAqCrGGFSVYrGItbYlItvGmJrv+7+Ms6+cVgPW2lngE+BtoDAm7xFw1xizWSqVnoyaOLIGwjC8AVjg/SxzVX0DuA3cB/50wwXggyRJbLPZvD7KIzMD1tpbwD1getQGQRBI/3l3d7d4eHh4C9gEXnLDXaAaBMHDYeuHZsD98lPNT2phYSEKguBbz/MWReSuG54GalmZGACw1s4mSbL1rOZp+b7fXV5efk9VP+pDGGO22u3286cC0Cu42UnN0yqXy5+JyFcuvBTH8e2RAGEYXqNX7WcmY8yHwG8ufLfRaFzNBFDVKuO/amPJ9/0uvawCFI0x1VEAuRwMnuc9AP4CEJG1oQCdTucisJwHgMvC9y4s1+v1CwMAURTN52Ge0o77lEKhcOx1DKCqc3m6i8jjlNflAQAR0TwBVFXS4TCA/ZwBrhybGnOcjXQN7OUJICJ+nyWKokcDAK6ZaOVh3m63p4GbLmysrKw8HQBwlNt5AMRx/CrwHICqfpf+7j8AxpgaEJ2leavVmqF3PANEqlrLBHBt1NdnCSAinwMvuucvK5XKr5kAAMaYTeD3szDf2dn5GHjHhftTU1N3BvxODpRKpSdJkmzQ62QmUqvVmrHWfqOqn7qhv1V1Y2lp6eBUAIBKpfIDUH1WiHa7PW2tfV1EfgLe6psD1XK5/OOwNSO74mazed0YswVcypojIm8mSfKCe89v4qrdaV9VN7LMAbzFxcVMgLm5ub2Dg4N7qjoDVABvyLQ1EXkFeJl/27hIRL4oFAqvlUqlnzMNGONe0Fej0bhqjKm687wydDORRpIk26paO1nt/xsgrXq9fqFYLF6J43gewPO8vSiKHqX/4cbVRHdDZ/QUCCdZn9a5347/AXiOIF3eOlFfAAAAAElFTkSuQmCC");
        const tray = new Tray(img);
        const menu = Menu.buildFromTemplate([
            { label: "Light", click: light },
            { label: "Dark", click: dark },
            { label: "Exit", click: exit },
        ]);
        tray.setContextMenu(menu);
    }
});
