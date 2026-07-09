/**
 * Mutex assíncrono por chave (FIFO).
 *
 * O servidor é um único processo Node, então um lock em memória basta para
 * serializar operações de "ler → modificar → gravar" no mesmo arquivo e evitar
 * lost updates entre requisições concorrentes.
 *
 * Uso:
 *   await withLock(filePath, async () => { ...seção crítica... });
 *
 * Todas as chamadas com a mesma `key` rodam uma de cada vez, na ordem de chegada.
 * Chaves diferentes rodam em paralelo. A entrada é removida do mapa quando a fila
 * daquela chave esvazia, então não há vazamento de memória.
 */
const tails = new Map();

export function withLock(key, fn) {
  const prev = tails.get(key) ?? Promise.resolve();

  // resultado que o chamador aguarda (propaga valor/erro de fn)
  const result = prev.then(() => fn());

  // cadeia que nunca rejeita, usada só para encadear a próxima chamada
  const chain = result.then(() => {}, () => {});
  tails.set(key, chain);

  // limpeza: quando esta cadeia terminar E ainda for a última da fila, remove a chave
  chain.finally(() => {
    if (tails.get(key) === chain) tails.delete(key);
  });

  return result;
}
