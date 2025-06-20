import clsx from "clsx";

import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react";
import { useUser } from "~/store";
import { useTasks } from "~/hooks/data";

import { GoogleOAuth, type GoogleOAuthBtnRef } from "~/features/oauth";
import { X, ImageOff } from "lucide-react";
import { Image } from "~/components/common";

import { HairstyleSelect, type Hairstyle } from "./hairstyle-select";
import { StyleConfiguration, type HairColor } from "./style-configuration";
import { ConfirmPreview } from "./confirm-preview";

import type { AiHairstyleResult } from "~/routes/_api/create.ai-hairstyle/route";
import type { TaskResult } from "~/routes/_api/task.$task_no/route";

export type { Hairstyle, HairColor };

export interface HairstyleChangerRef {
  open: (file: File) => void;
  close: () => void;
}

export interface Heading {
  title: string;
  subtitle: string;
}
interface HairstyleChangerProps {
  headings: Heading[];
  types: Array<{ label: string; value: string }>;
  hairstyles: Hairstyle[];
  colors: HairColor[];
}

export const HairstyleChanger = forwardRef<
  HairstyleChangerRef,
  HairstyleChangerProps
>(({ headings, types, hairstyles, colors }, ref) => {
  const loginRef = useRef<GoogleOAuthBtnRef>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  const user = useUser((state) => state.user);
  const setCredits = useUser((state) => state.setCredits);

  const [file, setFile] = useState<File>();
  const fileUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);
  const [confirmError, setConfirmError] = useState(false);

  const [step, setStep] = useState(0);
  const [activeType, setActiveType] = useState(types[0].value ?? "");
  const [hairstyle, setHairstyle] = useState<string[]>([]);

  const [color, setColor] = useState("");
  const [detail, setDetail] = useState("");

  // Loading for Form submit
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!formContainerRef.current) return;
    formContainerRef.current.scrollTo({ top: 0 });
  }, [step]);

  const [tasks, setTasks] = useTasks<
    AiHairstyleResult["tasks"][number] & { progress: number }
  >({
    onUpdateTask: async (task) => {
      const res = await fetch(`/api/task/${task.task_no}`);
      if (res.ok) {
        const result = await res.json<TaskResult>();
        const { task, progress } = result;

        return { ...task, progress };
      } else return task;
    },
    taskKey: "task_no",
    verifySuccess: (task) => ["failed", "succeeded"].includes(task.status),
    intervalMs: 8000,
    immediate: true,
  });

  const checkedHairstyles = useMemo(() => {
    return hairstyle.map(
      (style) => hairstyles.find((item) => item.value === style)!
    );
  }, [hairstyles, hairstyle]);

  const checkedHairColor = useMemo(() => {
    let value = colors.find((item) => item.value === color);
    if (!value) value = colors.find((item) => item.value === "")!;
    return value;
  }, [colors, color]);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: () => modalRef.current?.close(),
  }));

  const handleOpen = (file: File) => {
    if (!modalRef.current) return;
    setFile(file);
    modalRef.current.showModal();
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);

    setStep(0);
    setFile(undefined);
    setConfirmError(false);
    // setActiveType("");
    setHairstyle([]);
    setColor("");
    setDetail("");
    setSubmitting(false);
    setDone(false);
    setTasks([]);
    formContainerRef.current?.scrollTo({ top: 0 });
  };

  const handleSubmit = async () => {
    if (!file) return;

    if (!user && loginRef.current) {
      loginRef.current.login();
      return;
    } else {
      setSubmitting(true);
      const form = new FormData();

      form.set("photo", file);
      form.set("hairstyle", JSON.stringify(checkedHairstyles));
      form.set("hair_color", JSON.stringify(checkedHairColor));
      form.set("detail", detail);

      const res = await fetch("/api/create/ai-hairstyle", {
        method: "post",
        body: form,
      }).finally(() => setSubmitting(false));
      if (res.ok) {
        const result = await res.json<AiHairstyleResult>();
        const { tasks, consumptionCredits } = result;

        setCredits(consumptionCredits.remainingBalance);
        setTasks(tasks.map((item) => ({ ...item, progress: 0 })));
        setDone(true);
      }
    }
  };

  const nextStep = () => {
    if (submitting) return;
    if (step === 2) {
      handleSubmit();
      return;
    }
    if (step === 0 && !hairstyle.length) {
      setConfirmError(true);
      return;
    }
    setStep((step) => step + 1);
    setConfirmError(false);
  };
  const prevStep = () => {
    if (step === 0) modalRef.current?.close();
    setStep(step - 1);
  };

  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle"
      onClose={handleClose}
    >
      {visible && (
        <>
          <div
            className={clsx(
              "modal-box p-0 relative",
              "max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4rem)]",
              "sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
            )}
            hidden={done}
            ref={formContainerRef}
          >
            <header className="sticky top-0 flex w-full bg-base-100 border-b border-base-300 p-3 sm:p-4 z-10">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base leading-none mb-1">
                  {headings[step]?.title}
                </div>
                <p className="text-sm leading-none opacity-60">
                  {headings[step]?.subtitle}
                </p>
              </div>
              {!submitting && (
                <form method="dialog">
                  <button className="cursor-pointer">
                    <X />
                  </button>
                </form>
              )}
            </header>
            <main className="p-3 pt-1 sm:p-4 sm:pt-2">
              <HairstyleSelect
                className="aria-hidden:hidden"
                aria-hidden={step !== 0}
                types={types}
                activeType={activeType}
                onChangeType={setActiveType}
                hairstyles={hairstyles}
                value={hairstyle}
                onChange={(e) => {
                  setHairstyle(e);
                  setConfirmError(false);
                }}
              />
              <StyleConfiguration
                className="aria-hidden:hidden mt-2"
                aria-hidden={step !== 1}
                colors={colors}
                color={color}
                onColorChange={setColor}
                detail={detail}
                onDetailChange={setDetail}
              />
              {file && (
                <ConfirmPreview
                  className="aria-hidden:hidden mt-2"
                  aria-hidden={step !== 2}
                  original={file}
                  hairstyles={checkedHairstyles}
                  color={checkedHairColor}
                  detail={detail}
                />
              )}
            </main>
            <footer className="sticky bottom-0 w-full bg-base-100 border-t border-base-300 p-3 sm:p-4 z-10">
              <div className="flex items-center gap-3">
                {confirmError && step === 0 && (
                  <div className="max-sm:hidden">
                    <p className="text-base text-error">
                      Select a hairstyle to continue
                    </p>
                  </div>
                )}
                {step > 0 && !submitting && (
                  <div className="max-sm:flex-1 min-w-0">
                    <button
                      type="submit"
                      className="btn btn-block rounded-box"
                      onClick={prevStep}
                    >
                      Previous Step
                    </button>
                  </div>
                )}
                <div className="max-sm:hidden grow" />
                <div className="max-sm:flex-1 min-w-0">
                  {step === 0 && (
                    <button
                      type="submit"
                      className="btn btn-primary btn-block rounded-box"
                      onClick={nextStep}
                    >
                      Confirm Selection
                      {!!hairstyle.length && (
                        <span> ({hairstyle.length} credits)</span>
                      )}
                    </button>
                  )}
                  {step === 1 && (
                    <button
                      type="submit"
                      className="btn btn-primary btn-block rounded-box"
                      onClick={nextStep}
                    >
                      Preview
                    </button>
                  )}
                  {step === 2 && (
                    <button
                      type="submit"
                      className="btn btn-primary btn-block rounded-box  data-[loading=true]:cursor-not-allowed transition-all duration-200"
                      onClick={nextStep}
                      data-loading={submitting}
                    >
                      <span
                        className="loading loading-spinner hidden data-[loading=true]:block"
                        data-loading={submitting}
                      />
                      {submitting ? "Submitting" : "Transform Hair"}
                    </button>
                  )}
                </div>
              </div>
              {confirmError && step === 0 && (
                <div className="mt-2 sm:hidden">
                  <p className="text-center text-xs text-error">
                    Select a hairstyle to continue
                  </p>
                </div>
              )}
            </footer>
          </div>
          {done && (
            <div
              className={clsx(
                "modal-box p-0 relative",
                "max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4rem)]",
                "sm:max-w-xl"
              )}
            >
              <header className="sticky top-0 flex w-full bg-base-100 border-b border-base-300 p-3 sm:p-4 z-10">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base leading-none mb-1">
                    AI Hairstyle Result
                  </div>
                  <p className="text-sm leading-none opacity-60">
                    Check your AI Hairstyle Result
                  </p>
                </div>
                <form method="dialog">
                  <button className="cursor-pointer">
                    <X />
                  </button>
                </form>
              </header>
              <main className="p-3 sm:p-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div
                      className="w-full bg-base-300 rounded-box overflow-hidden flex flex-col items-center justify-center"
                      style={{
                        aspectRatio: "2/3",
                      }}
                    >
                      {fileUrl && (
                        <div className="w-full h-full">
                          <Image
                            className="w-full h-full object-cover"
                            src={fileUrl}
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className="text-center text-xs leading-none whitespace-nowrap overflow-hidden overflow-ellipsis mt-1 before:content-[attr(aria-label)]"
                      aria-label="Original Photo"
                    />
                  </div>
                  {tasks.map((task) => (
                    <div key={task.task_no}>
                      <div
                        className="w-full bg-base-300 rounded-box overflow-hidden flex flex-col items-center justify-center"
                        style={{
                          aspectRatio: "2/3",
                        }}
                      >
                        {task.status === "pending" && (
                          <div className="flex flex-col items-center justify-center">
                            <div className="loading loading-xl mb-2" />
                            <div className="text-xs sm:text-sm text-center opacity-70 whitespace-pre-line">
                              <p>
                                Scanning your
                                <br />
                                hairstyle and face
                              </p>
                            </div>
                          </div>
                        )}
                        {task.status === "running" && (
                          <div className="flex flex-col items-center justify-center">
                            <div className="loading loading-xl mb-2" />
                            <div className="text-xs sm:text-sm text-center opacity-70 whitespace-pre-line">
                              <p>
                                Creating your look
                                <br />
                                {task.progress > 0
                                  ? `${task.progress}% Complete`
                                  : "Almost there!"}
                              </p>
                            </div>
                          </div>
                        )}
                        {(task.status === "failed" ||
                          (task.status === "succeeded" &&
                            !task.result_url)) && (
                          <div className="flex flex-col items-center justify-center max-w-5/6">
                            <ImageOff className="mb-2 opacity-50" size={36} />
                            <div className="text-xs sm:text-sm text-center opacity-70 whitespace-pre-line">
                              <p>{task.fail_reason}</p>
                            </div>
                          </div>
                        )}
                        {task.status === "succeeded" && !!task.result_url && (
                          <div className="w-full h-full">
                            <Image
                              className="w-full h-full object-cover"
                              src={task.result_url}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        className="text-center text-xs leading-none whitespace-nowrap overflow-hidden overflow-ellipsis mt-1 before:content-[attr(aria-label)]"
                        aria-label={
                          (task.ext.hairstyle as string) ?? "Untitled Style"
                        }
                      />
                    </div>
                  ))}
                </div>
              </main>
              <footer className="sticky bottom-0 w-full bg-base-100 border-t border-base-300 p-3 sm:p-4 z-10">
                <p className="text-center text-sm opacity-70">
                  Wait a moment, we’re crafting your new hairstyle (1-2 mins)
                </p>
              </footer>
            </div>
          )}
        </>
      )}
      {user === null && (
        <div hidden>
          <GoogleOAuth ref={loginRef} onSuccess={handleSubmit} />
        </div>
      )}
    </dialog>
  );
});
