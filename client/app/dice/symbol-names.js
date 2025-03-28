// Symbol to name mapping for Star Wars RPG dice
export const SymbolNames = {
  // Basic symbols
  's': 'Success',
  'f': 'Failure',
  'a': 'Advantage',
  't': 'Threat',
  'x': 'Triumph',
  'y': 'Despair',
  'Z': 'Light',
  'z': 'Dark'
};

// Function to convert symbol to name
export function getSymbolName(symbol) {
  return SymbolNames[symbol] || symbol;
}
