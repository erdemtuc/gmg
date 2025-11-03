'use client';
import { useState } from 'react';
import { PageWizardModal } from '@/components/modals/PageWizardModal';

export default function MenuWizardPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  const handleSelectPage = (pageType: string) => {
    console.log(`${pageType} selected`);
    // Here you would typically do something with the selected page type
    // For now, we'll just keep the modal open as an example
    // In a real application, you might navigate to a new page or update state
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 menu-wizard-page">
      <div className="inline-flex justify-start items-start gap-4">
        <div className="w-80 h-[817px] inline-flex flex-col justify-start items-start gap-2">
          <div className="self-stretch h-96 p-6 relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col justify-start items-start gap-4 overflow-hidden">
            <div className="self-stretch flex flex-col justify-center items-center">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="flex-1 justify-start text-zinc-700 text-base font-medium leading-6">Page design</div>
                <div className="justify-center text-blue-700 text-xs font-medium leading-4">Add/Delete Types</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Work order</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Customer visit</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Send invoice</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Demo request</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Phone call</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Email from contact</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Accept Invoice</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Email to contact</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-slate-50 rounded outline outline-1 outline-offset-[-1px] outline-blue-700 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-blue-700 text-sm font-normal leading-6">Meeting</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Receive payment</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Shipment</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Make payment</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-28 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Send invoice</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-8 px-2 py-1 bg-neutral-50 rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2">
                  <div className="w-28 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Demo request</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1.5 h-16 left-[293px] top-[64px] absolute bg-neutral-200 rounded-[32px]" />
          </div>
          <div className="self-stretch h-96 p-6 relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col justify-start items-start gap-4 overflow-hidden">
            <div className="w-72 h-10 left-[16px] top-[168px] absolute bg-neutral-100 rounded-md" />
            <div className="self-stretch flex flex-col justify-center items-center">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="flex-1 justify-start text-zinc-700 text-base font-medium leading-6">Fields of other types</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
              <div className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 self-stretch flex justify-center items-center gap-2">
                  <div className="flex-1 self-stretch justify-center text-zinc-400 text-xs font-medium leading-4">Search</div>
                </div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Text fields</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="LTR" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-3 left-[1.67px] top-[4.17px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Amount</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div data-style="Outlined" data-type="LTR" className="w-5 h-5 relative overflow-hidden">
                        <div className="w-4 h-3 left-[1.67px] top-[4.17px] absolute bg-zinc-700 border border-zinc-700" />
                      </div>
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Collection Amount</div>
                    </div>
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-4 left-[1.67px] top-[1.67px] absolute bg-neutral-500 border border-neutral-500" />
                    </div>
                    <div data-style="Outlined" data-type="Vertical" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-2 h-3.5 left-[5.83px] top-[2.50px] absolute bg-neutral-500 border border-neutral-500" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="LTR" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-3 left-[1.67px] top-[4.17px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Payment Amount</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Dropdowns</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="LTR" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Due</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="LTR" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Payment Due</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Selectors</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                  <div data-style="Outlined" className="w-5 h-5 relative overflow-hidden">
                    <div className="w-4 h-4 left-[1.67px] top-[1.67px] absolute bg-zinc-700 border border-zinc-700" />
                  </div>
                  <div className="w-24 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start">
                      <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Method</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4 h-4 left-[88px] top-[199px] absolute shadow-[0px_1px_3px_0px_rgba(0,0,0,0.35)]">
              <div className="w-3.5 h-4 left-[0.39px] top-[0.41px] absolute bg-white" />
              <div className="w-3.5 h-4 left-[0.39px] top-[0.41px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
              <div className="w-px h-[3.46px] left-[11.52px] top-[9.21px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
              <div className="w-px h-[3.47px] left-[9.49px] top-[9.20px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
              <div className="w-px h-[3.43px] left-[7.51px] top-[9.23px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
            </div>
          </div>
        </div>
        <div className="w-[684px] h-[817px] relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200">
          <div className="w-[655px] h-7 left-[15px] top-[771px] absolute inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <div data-destructive="False" data-show-icon-right="false" data-show-icon="true" data-size="S" data-state="Default" data-variant="Primary" className="px-3.5 py-2 bg-blue-700 rounded flex justify-center items-center gap-1.5 overflow-hidden">
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3 h-2 left-[2.17px] top-[4.17px] absolute bg-white" />
                </div>
                <div className="justify-center text-white text-xs font-medium leading-4">Save & Exit</div>
              </div>
              <div data-destructive="False" data-show-icon-right="false" data-show-icon="true" data-size="S" data-state="Default" data-variant="Outline" className="px-3.5 py-2 bg-white rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-center items-center gap-1.5 overflow-hidden">
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-2.5 h-2.5 left-[2.83px] top-[2.83px] absolute bg-neutral-500" />
                </div>
                <div className="justify-center text-neutral-500 text-xs font-medium leading-4">Cancel</div>
              </div>
              <div data-destructive="False" data-show-icon-right="false" data-show-icon="true" data-size="S" data-state="Default" data-variant="Outline" className="px-3.5 py-2 bg-white rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-center items-center gap-1.5 overflow-hidden">
                <div data-on="On" data-style="Outlined" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3 h-2 left-[1.52px] top-[3.67px] absolute bg-neutral-500" />
                </div>
                <div className="justify-center text-neutral-500 text-xs font-medium leading-4">Preview</div>
              </div>
            </div>
            <div data-destructive="False" data-show-icon-right="false" data-show-icon="true" data-size="S" data-state="Default" data-variant="Secondary" className="px-1 py-2 rounded flex justify-center items-center gap-1.5 overflow-hidden">
              <div data-style="Outlined" data-type="Circle" className="w-4 h-4 relative overflow-hidden">
                <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute bg-blue-700" />
              </div>
              <div className="justify-center text-blue-700 text-xs font-medium leading-4">How to use the page wizard?</div>
            </div>
          </div>
          <div className="w-[685px] h-0 left-0 top-[755px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>
          <div className="left-[24px] top-[24px] absolute inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-start gap-3">
              <div className="flex justify-start items-center gap-2">
                <div data-property-1="Default" className="w-4 h-4 relative bg-white rounded-[20px] border border-zinc-400" />
                <div className="justify-start text-zinc-700 text-xs font-medium leading-4">Pending</div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <div data-property-1="Selected" className="w-4 h-4 relative bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-700 overflow-hidden">
                  <div className="w-3 h-3 left-[3px] top-[3px] absolute bg-blue-700 rounded-[999px]" />
                </div>
                <div className="justify-start text-zinc-700 text-xs font-medium leading-4">Complited</div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Select source</div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Type</div>
                </div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 h-20 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="false" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch flex-1 p-2 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Type web page URL</div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Description</div>
                </div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">03/10/2025</div>
                <div data-style="Outlined" data-type="LTR" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.25px] top-[2.25px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Due Date</div>
                </div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Select source</div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Assigned to</div>
                </div>
              </div>
            </div>
          </div>
          <div className="left-[359px] top-[58px] absolute inline-flex flex-col justify-start items-start gap-4">
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Select source</div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Contact/Client</div>
                </div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Select source</div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Opportunity</div>
                </div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Select source</div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Proposal/Quote</div>
                </div>
              </div>
            </div>
            <div data-hint="false" data-input-title="true" data-property-1="Default" className="w-72 relative flex flex-col justify-start items-start gap-[5px]">
              <div data-destructive="False" data-icons-left="false" data-icons-right="true" data-input-action="false" data-state="Default" data-tags-bar="false" className="self-stretch px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Select source</div>
                <div data-style="Outlined" data-type="Default" className="w-4 h-4 relative overflow-hidden">
                  <div className="w-3.5 h-3.5 left-[2.06px] top-[2.06px] absolute bg-neutral-500" />
                </div>
              </div>
              <div data-help-icon="false" data-optional-tag="false" data-property-1="Default" className="h-0.5 left-[8px] top-0 absolute bg-white inline-flex justify-start items-center gap-1">
                <div className="px-1.5 flex justify-start items-center gap-1">
                  <div className="justify-center text-neutral-500 text-xs font-normal leading-4">Order/Job</div>
                </div>
              </div>
            </div>
            <div className="w-72 h-9 px-28 py-1.5 rounded-[3px] outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex justify-center items-center gap-2 overflow-hidden">
              <div data-style="Outlined" data-type="Add" className="w-3.5 h-3.5 relative overflow-hidden">
                <div className="w-3 h-3 left-[0.58px] top-[1.17px] absolute bg-zinc-500" />
              </div>
              <div className="justify-start"><span className="text-zinc-500 text-xs font-normal leading-4">Drag & Drop files here or </span><span className="text-blue-700 text-xs font-normal leading-4">Upload file</span></div>
            </div>
          </div>
        </div>
        <div className="w-64 self-stretch p-6 relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
          <div className="w-56 h-10 left-[16px] top-[180px] absolute bg-neutral-100 rounded-md" />
          <div className="self-stretch flex flex-col justify-center items-center">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="flex-1 justify-start text-zinc-700 text-base font-medium leading-6">Elements</div>
              <div data-style="Outlined" data-type="Circle" className="w-4 h-4 relative overflow-hidden">
                <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute bg-neutral-500" />
              </div>
            </div>
            <div className="self-stretch justify-start text-neutral-500 text-sm font-normal leading-6">Select and drag the relevant field</div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Text elements</div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Date" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Date</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-4 left-[1.67px] top-[1.67px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Time</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                        <div className="w-3 h-3.5 left-[4.17px] top-[3.33px] absolute bg-zinc-700 border border-zinc-700" />
                      </div>
                      <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Text</div>
                    </div>
                    <div data-style="Outlined" data-type="Vertical" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-2 h-3.5 left-[5.83px] top-[2.50px] absolute bg-neutral-500 border border-neutral-500" />
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-4 left-[1.67px] top-[1.67px] absolute bg-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Number</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Note</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="LTR" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-3 left-[1.67px] top-[3.75px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">List</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-3.5 left-[2.08px] top-[2.50px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="justify-start text-zinc-700 text-sm font-normal leading-6">Section/ Heading</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-3 left-[1.67px] top-[4.17px] absolute bg-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Money</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Action elements</div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" className="w-5 h-5 relative">
                      <div className="w-4 h-3 left-[1.25px] top-[3.75px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Button</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-4 left-[3.33px] top-[1.67px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="w-24 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Calculated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Location elements</div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-4 left-[2.74px] top-[1.68px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Location</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-4 left-[1.67px] top-[1.67px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">State/Province</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-4 left-[2.92px] top-[1.66px] absolute bg-zinc-700" />
                    </div>
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">City/Town</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-zinc-500 text-xs font-normal uppercase leading-4">Other elements</div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-4 left-[1.67px] top-[1.87px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Product</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-3.5 h-4 left-[3.34px] top-[1.67px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">User</div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch py-1 rounded-lg inline-flex justify-start items-center gap-2">
                    <div data-style="Outlined" data-type="Default" className="w-5 h-5 relative overflow-hidden">
                      <div className="w-4 h-3.5 left-[1.67px] top-[2.50px] absolute bg-zinc-700 border border-zinc-700" />
                    </div>
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 inline-flex flex-col justify-center items-start">
                        <div className="self-stretch justify-start text-zinc-700 text-sm font-normal leading-6">Company/Person</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-4 h-4 left-[88px] top-[208px] absolute shadow-[0px_1px_3px_0px_rgba(0,0,0,0.35)]">
            <div className="w-3.5 h-4 left-[0.39px] top-[0.41px] absolute bg-white" />
            <div className="w-3.5 h-4 left-[0.39px] top-[0.41px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
            <div className="w-px h-[3.46px] left-[11.52px] top-[9.21px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
            <div className="w-px h-[3.47px] left-[9.49px] top-[9.20px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
            <div className="w-px h-[3.43px] left-[7.51px] top-[9.23px] absolute outline outline-[0.75px] outline-offset-[-0.38px] outline-black" />
          </div>
        </div>
      </div>

      {/* Page Wizard Modal */}
      <PageWizardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPage={handleSelectPage}
      />
    </div>
  );
}
