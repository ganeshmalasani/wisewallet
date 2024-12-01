const { execSync } = require('child_process');

const components = [
  'button',
  'card',
  'input',
  'select',
  'table',
  'chart',
];

components.forEach(component => {
  try {
    execSync(`npx shadcn@latest add ${component} --yes`, { stdio: 'inherit' });
    console.log(`Successfully added ${component}`);
  } catch (error) {
    console.error(`Failed to add ${component}: ${error.message}`);
  }
});

