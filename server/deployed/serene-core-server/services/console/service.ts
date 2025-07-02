import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export class ConsoleService {
  private rl = readline.createInterface({ input, output })

  async askQuestion(query: string): Promise<string> {

    const answer = await this.rl.question(query)
    this.rl.close()
    return answer
  }
}
