"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
interface AIModalProps {
    open: boolean;
    onClose: () => void;
  }
  
  export default function AIModal({ open, onClose }: AIModalProps) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-zinc-800 text-white border-none shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none shine-effect"></div>
          <CardHeader className="relative pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-transparent"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <CardTitle className="text-base font-normal text-gray-300 text-center">
              To Continue using for free, Please upgrade your plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">Limit Reached</h1>
              <CardDescription className="text-gray-400 text-sm px-4">
                Unlock More AI Suggestions, Follow up questions, Large Queries, History, Save & Share your Searches
                and more features.
              </CardDescription>
            </div>
  
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 h-12">
                show pricing
              </Button>
            </div>
          </CardContent>
        </Card>
  
        <style jsx>{`
          .shine-effect {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
            width: 100%;
            height: 100%;
            transform: translateX(-100%);
            animation: shine 8s infinite;
          }
  
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }
  