const { registry } = require("windows");

const theme = registry("HKCU/SOFTWARE/Microsoft/Windows/CurrentVersion/Themes/Personalize");

function light() {
    theme.add('AppsUseLightTheme', 1);
    // theme.add('SystemUsesLightTheme', 1);
}

function dark() {
    theme.add('AppsUseLightTheme', 0);
    // theme.add('SystemUsesLightTheme', 0);
}

module.exports = {
    light, dark
};
