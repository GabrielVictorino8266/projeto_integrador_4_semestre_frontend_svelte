/**
 * Ação Svelte que dispara um evento `dismiss` quando:
 * - o usuário clica fora do elemento, ou
 * - pressiona a tecla Escape.
 *
 * Exemplo:
 * <div use:dismissable on:dismiss={fechar}/>
 */
export default function dismissable(node, { active = false } = {}) {
  let isActive = active;

  const handleClick = (e) => {
    if (!isActive || node.contains(e.target)) {
      return;
    }

    setTimeout(() => {
      node.dispatchEvent(new CustomEvent("dismiss"));
    }, 0);
  };

  const handleKeydown = (e) => {
    if (!isActive || e.key !== "Escape") {
      return;
    }

    setTimeout(() => {
      node.dispatchEvent(new CustomEvent("dismiss"));
    }, 0);
  };

  document.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", handleKeydown);

  return {
    update({ active }) {
      isActive = active;
    },
    destroy() {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeydown);
    },
  };
}
