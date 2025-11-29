import { useEffect, useRef, RefObject } from "react";

interface UseFormNavigationOptions {
  onSubmit?: () => void;
  enabled?: boolean;
  submitButtonRef?: RefObject<HTMLButtonElement>;
  onExitUp?: () => void;
  onExitDown?: () => void;
}

/**
 * Hook para navegação de formulários com teclado
 * - Setas cima/baixo: navega entre inputs
 * - Enter: abre select se focado, senão submete o formulário
 */
export const useFormNavigation = (
  formRef: RefObject<HTMLFormElement | HTMLDivElement | null>,
  options: UseFormNavigationOptions = {}
) => {
  const { onSubmit, enabled = true, submitButtonRef, onExitUp, onExitDown } = options;
  const focusableElements = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!enabled || !formRef.current) return;

    const updateFocusableElements = () => {
      if (!formRef.current) return;

      // Seleciona todos os elementos focáveis dentro do formulário
      const elements = formRef.current.querySelectorAll<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), button:not([disabled]), select:not([disabled])'
      );

      focusableElements.current = Array.from(elements).filter(
        (el) => {
          // Filtra apenas elementos visíveis
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
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
          } else {
            // Se estiver no último elemento
            if (onExitDown) {
                onExitDown();
            } else {
                // Comportamento padrão: volta para o primeiro
                focusableElements.current[0]?.focus();
            }
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            focusableElements.current[currentIndex - 1]?.focus();
          } else {
            // Se estiver no primeiro elemento
            if (onExitUp) {
                onExitUp();
            } else {
                // Comportamento padrão: vai para o último
                focusableElements.current[focusableElements.current.length - 1]?.focus();
            }
          }
          break;

        case 'Enter':
          // Se for um checkbox, simula o clique para marcar/desmarcar
          if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
            // O comportamento padrão do Enter no checkbox não é marcar, então forçamos o click
            // Mas prevenimos o default para não submeter formulário se houver
            e.preventDefault();
            target.click();
            return;
          }

          // Se for um select, abre o dropdown
          if (target.tagName === 'SELECT') {
            const selectElement = target as HTMLSelectElement;
            
            // Tenta usar showPicker se disponível (Chrome 121+)
            if ('showPicker' in selectElement && typeof selectElement.showPicker === 'function') {
              try {
                selectElement.showPicker();
                return;
              } catch (err) {
                // Fallback se falhar
              }
            }

            // Fallback para simulação de clique
            const clickEvent = new MouseEvent('mousedown', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            selectElement.dispatchEvent(clickEvent);
            return;
          }

          // Se for um textarea, permite quebra de linha
          if (target.tagName === 'TEXTAREA') {
            return;
          }

          // Se for um botão, deixa o comportamento padrão
          if (target.tagName === 'BUTTON') {
            return;
          }

          e.preventDefault();
          
          // Se houver um botão de submit via ref, clica nele
          if (submitButtonRef?.current) {
            submitButtonRef.current.click();
          } else {
            // Senão, procura um botão de submit no formulário
            const submitButton = formRef.current?.querySelector<HTMLButtonElement>(
              'button[type="submit"], button:not([type="button"])'
            );
            
            if (submitButton) {
              submitButton.click();
            } else if (onSubmit) {
              onSubmit();
            }
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
        attributeFilter: ['disabled', 'style', 'class', 'hidden'],
      });
    }

    updateFocusableElements();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [formRef, onSubmit, enabled, submitButtonRef, onExitUp, onExitDown]);

  return {
    // Função para focar no primeiro elemento
    focusFirst: () => {
        // Pequeno delay para garantir que o elemento esteja visível/renderizado se necessário
        setTimeout(() => {
            if (focusableElements.current.length === 0 && formRef.current) {
                 // Tenta atualizar se a lista estiver vazia
                 const elements = formRef.current.querySelectorAll<HTMLElement>(
                    'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), button:not([disabled]), select:not([disabled])'
                  );
                  focusableElements.current = Array.from(elements).filter(el => {
                      const style = window.getComputedStyle(el);
                      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                  });
            }
            focusableElements.current[0]?.focus();
        }, 0);
    },
    // Função para focar no último elemento
    focusLast: () => {
        setTimeout(() => {
            if (focusableElements.current.length === 0 && formRef.current) {
                 const elements = formRef.current.querySelectorAll<HTMLElement>(
                    'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), button:not([disabled]), select:not([disabled])'
                  );
                  focusableElements.current = Array.from(elements).filter(el => {
                      const style = window.getComputedStyle(el);
                      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                  });
            }
            const last = focusableElements.current[focusableElements.current.length - 1];
            last?.focus();
        }, 0);
    },
  };
};

