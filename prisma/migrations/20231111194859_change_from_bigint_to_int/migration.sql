/*
  Warnings:

  - You are about to alter the column `amountBet` on the `Bet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `amountWon` on the `Bet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `balance` on the `Participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Bet" ALTER COLUMN "amountBet" SET DATA TYPE INTEGER,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "amountWon" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "balance" SET DATA TYPE INTEGER;
