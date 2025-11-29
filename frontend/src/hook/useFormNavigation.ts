import { useEffect, useRef, RefObject } from "react";

interface UseFormNavigationOptions {
  onSubmit?: () => void;
  enabled?: boolean;
}

/**
 * Hook para navegação de formulários com teclado
 * - Setas cima/baixo: navega entre inputs
 * - Enter: confirma/envia o formulário
 */
export const useFormNavigation = (
  formRef: RefObject<HTMLFormElement | HTMLDivElement>,
  options: UseFormNavigationOptions = {}
) => {
  const { onSubmit, enabled = true } = options;
  const focusableElements = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!enabled || !formRef.current) return;

    const updateFocusableElements = () => {
      if (!formRef.current) return;

      // Seleciona todos os elementos focáveis dentro do formulário
      const elements = formRef.current.querySelectorAll<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), button:not([disabled]), select:not([disabled])'
      );

      focusableElements.current = Array.from(elements).filter(
        (el) => {
          // Filtra apenas elementos visíveis
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Verifica se o elemento ativo está dentro do formulário
      if (!formRef.current?.contains(target)) return;

      updateFocusableElements();
      const currentIndex = focusableElements.current.indexOf(target);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < focusableElements.current.length - 1) {
            focusableElements.current[currentIndex + 1]?.focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            focusableElements.current[currentIndex - 1]?.focus();
          }
          break;

        case 'Enter':
          // Se for um textarea, permite quebra de linha
          if (target.tagName === 'TEXTAREA') {
            return;
          }

          // Se for um botão, deixa o comportamento padrão
          if (target.tagName === 'BUTTON') {
            return;
          }

          e.preventDefault();
          
          // Se houver um botão de submit, clica nele
          const submitButton = formRef.current?.querySelector<HTMLButtonElement>(
            'button[type="submit"]'
          );
          
          if (submitButton) {
            submitButton.click();
          } else if (onSubmit) {
            onSubmit();
          }
          break;
      }
    };

    // Atualiza a lista de elementos focáveis quando o DOM muda
    const observer = new MutationObserver(updateFocusableElements);
    
    if (formRef.current) {
      observer.observe(formRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'style', 'class'],
      });
    }

    updateFocusableElements();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [formRef, onSubmit, enabled]);

  return {
    // Função para focar no primeiro elemento
    focusFirst: () => {
      focusableElements.current[0]?.focus();
    },
    // Função para focar no último elemento
    focusLast: () => {
      const last = focusableElements.current[focusableElements.current.length - 1];
      last?.focus();
    },
  };
};
