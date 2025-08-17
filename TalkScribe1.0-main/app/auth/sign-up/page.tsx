import SignUpForm from "@/components/sign-up-form"
import AnimatedBackground from "@/components/animated-background"

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <AnimatedBackground />
      <div className="relative z-10">
        <SignUpForm />
      </div>
    </div>
  )
}
