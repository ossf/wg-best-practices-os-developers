""" Compliant Code Example """
import asyncio
 
 
async def func(x: int):
    print(f"{x} - start")
    await asyncio.sleep(1)
    print(f"{x} - end")
 
 
async def run_async():
    await asyncio.gather(func(1), func(2), func(3))
 
 
asyncio.run(run_async())