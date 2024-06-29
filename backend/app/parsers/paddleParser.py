import re
import requests
from app.config import BACKEND_URL


def get_invoice_number(words):
    invoice_number = ''
    for i, word in enumerate(words):
        if 'faktura' in word.lower() or 'faktury' in word.lower():
            parts = word.split()
            for part in parts:
                splitted_parts = part.lower().split('c.')
                if len(splitted_parts) > 1:
                    for splitted_part in splitted_parts:
                        if splitted_part.isdigit():
                            invoice_number = splitted_part
                            return invoice_number
                if part.isdigit():
                    invoice_number = part
                    return invoice_number
            next_words = words[i + 1]
            next_words = next_words.split()
            for next_word in next_words:
                if next_word.isdigit():
                    return next_word
    return invoice_number


def get_variable_symbol(words):
    var_symbol = ''
    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('variabilny', 'var.symbol', 'vs:', 'v.s.')]):
            parts = word.split()
            for part in parts:
                if part.isdigit():
                    var_symbol = part
                    return var_symbol
            next_words = words[i + 1]
            next_words = next_words.split()
            for next_word in next_words:
                if next_word.isdigit():
                    return next_word
    return var_symbol


def get_date_of_issue(words):
    date_of_issue = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{2,4}")

    for i, word in enumerate(words):
        if any([kw in word.lower().rstrip(':') for kw in (
                'datum vystavenia', 'datum vyhotovenia', 'datum vyhotovenia', 'vyhotovena', 'vystavenia',
                'fakturacie')]):
            word = re.sub(
                r'(\d{1,2})\.\s+(\d{1,2})\.\s+(\d{2,4})', r'\1.\2.\3', word)
            word_parts = word.split()
            for part in word_parts:
                if date_pattern.match(part):
                    return part
                else:
                    split_word = part.split(':')
                    if len(split_word) > 1:
                        possible_date = split_word[1]
                        if date_pattern.match(possible_date):
                            return possible_date
            next_words = words[i + 1]
            next_words = next_words.split()
            for next_word in next_words:
                if date_pattern.match(next_word):
                    return next_word
    return date_of_issue


def get_due_date(words):
    due_date = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{2,4}")

    for i, word in enumerate(words):
        if any([kw in word.lower().rstrip(':') for kw in
                ('datum splatnosti', 'splatnost', 'splatnost:', 'splatnosti', 'splatnosti')]):
            word = re.sub(
                r'(\d{1,2})\.\s+(\d{1,2})\.\s+(\d{2,4})', r'\1.\2.\3', word)
            word_parts = word.split()
            for part in word_parts:
                if date_pattern.match(part):
                    return part
                else:
                    split_word = part.split(':')
                    if len(split_word) > 1:
                        possible_date = split_word[1]
                        if date_pattern.match(possible_date):
                            return possible_date
            next_words = words[i + 1]
            next_words = next_words.split()
            for next_word in next_words:
                if date_pattern.match(next_word):
                    return next_word
    return due_date


def get_delivery_date(words):
    delivery_date = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{2,4}")

    for i, word in enumerate(words):
        if any([kw in word.lower().rstrip(':') for kw in
                ('datum dodania', 'datum uskut.', 'datum plnenia', 'dodanie', 'dodania', 'datum dan.',
                 'danova povinnost', 'datum dod.', 'povinnost', 'datum zdanitelneho')]):
            word = re.sub(
                r'(\d{1,2})\.\s+(\d{1,2})\.\s+(\d{2,4})', r'\1.\2.\3', word)
            word_parts = word.split()
            for part in word_parts:
                if date_pattern.match(part):
                    return part
                else:
                    split_word = part.split(':')
                    if len(split_word) > 1:
                        possible_date = split_word[1]
                        if date_pattern.match(possible_date):
                            return possible_date
            next_words = words[i + 1]
            next_words = next_words.split()
            for next_word in next_words:
                if date_pattern.match(next_word):
                    return next_word
    return delivery_date


def get_payment_method(words):
    payment_method = ''
    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in (
                'forma uhrady', 'sposob uhrady', 'forma platby', 'sposob platby', 'spos. uhrady', 'uhrada', 'platba')]):
            for j in range(i, len(words)):
                next_word = words[j]
                if any(x in next_word.lower() for x in ['prevod', 'prevodom']):
                    return 'Bankovým prevodom'
                elif any(x in next_word.lower() for x in ['hotovosť', 'hotovosťou', 'hotovosti']):
                    return 'Hotovosťou'
                elif any(x in next_word.lower() for x in ['dobierka', 'dobierkou']):
                    return 'Dobierkou'
                elif any(x in next_word.lower() for x in ['karta', 'kartou']):
                    return 'Kartou'
                elif any(x in next_word.lower() for x in ['paypal', 'paypalom']):
                    return 'PayPal'
                elif any(x in next_word.lower() for x in ['terminal', 'terminalom']):
                    return 'Platobným terminálom'
                elif any(x in next_word.lower() for x in ['zapoctom', 'zapocet']):
                    return 'Zaplatením zápočtom'
                elif ':PP' in next_word:
                    return 'PP'
                else:
                    return words[j + 1]

    return payment_method


def get_total_price(words):
    total_price = ''
    pattern = re.compile(r"€?\b\d+(?:[,\s]\d+)*\b")
    for i, word in enumerate(words):
        if any([kw1 in word.lower() and kw2 in word.lower() for kw1, kw2 in
                (('celkom', '€'), ('spolu', '€'), ('celkom', 'eur'), ('spolu', 'eur'),
                 ('celkova', 'suma'), ('fakturovana', 'suma'), (
                         'celkova', 'hodnota'), ('suma', 'uhradu'),
                 ('spolu', 'uhradu'), ('fakturovana', 'hodnota'), (
                         'celkom', 'uhrade'), ('celkom', 'k'), ('k ', 'uhrade'),
                 ('na', 'zaplatenie'), ('celkom:', ''))]):
            parts = re.sub(r'(\d)\s+(\d)', r'\1\2', words[i + 1])
            parts = parts.split()
            for part in parts:
                if pattern.match(part):
                    total_price = part
                    return total_price
    return total_price


def get_bank(words):
    for i, word in enumerate(words):
        word_lower = word.lower()
        if 'vseobecna' in word_lower or 'vub' in word_lower:
            return 'Všeobecná úverová banka'
        if 'csob' in word_lower or 'československá obchodná' in word_lower:
            return 'ČSOB'
        if 'tatrabanka' in word_lower or 'tatra' in word_lower:
            return 'Tatrabanka'
        if 'fio' in word_lower or 'fio banka' in word_lower:
            return 'Fio banka'
        if 'unicredit' in word_lower or 'uni credit' in word_lower:
            return 'UniCredit Bank'
        if 'slovenska sporite' in word_lower or 'sporitelna' in word_lower or 'sporiteľna' in word_lower:
            return 'Slovenská sporiteľňa'
        if 'banka' in word_lower:
            next_word_lower = words[i + 1].lower()
            if 'vseobecna' in next_word_lower or 'vub' in next_word_lower:
                return 'Všeobecná úverová banka'
            if 'csob' in next_word_lower or 'československá obchodná' in next_word_lower:
                return 'ČSOB'
            if 'tatrabanka' in next_word_lower or 'tatra' in next_word_lower:
                return 'Tatrabanka'
            if 'fio' in word_lower or 'fio banka' in word_lower:
                return 'Fio banka'
            if 'unicredit' in word_lower or 'uni credit' in word_lower:
                return 'UniCredit Bank'
            if 'slovenska sporite' in word_lower or 'sporitelna' in word_lower or 'sporiteľna' in word_lower:
                return 'Slovenská sporiteľňa'
    return ''


def get_swift(lines):
    swift = ''
    pattern = re.compile(r'^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$')
    for i, line in enumerate(lines):
        if any([kw in line.lower() for kw in ('swift', 'swft', 'swiet', 'bic')]):
            words = line.split()
            for word in words:
                if len(word) >= 8:
                    if pattern.match(word):
                        swift = word
                        return swift
                    elif any([kw in line.lower() for kw in ('swift:', 'swft:', 'swiet:', 'bic:')]):
                        split_word = word.split(':')
                        if len(split_word) > 1:
                            possible_swift = split_word[1]
                            if pattern.match(possible_swift):
                                return possible_swift
                next_word = lines[i + 1]
                next_word = next_word.split()
                for next_word_part in next_word:
                    if len(next_word_part) >= 8:
                        if pattern.match(next_word_part):
                            return next_word_part
            for i, word in enumerate(words):
                last_word_index = len(words) - 1
                if word.lower() == 'swift:' and i != last_word_index:
                    return words[i + 1]
    return swift


def get_iban(words):
    iban = ''
    pattern = re.compile(
        r'[a-zA-Z]{2}\s*[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}')
    for i, word in enumerate(words):
        if 'iban' in word.lower() or 'ucet'.rstrip(':') in word.lower():
            word = re.sub(r'(\d)\s+(\d)', r'\1\2', word)
            part_word = word.split()
            for part in part_word:
                match = pattern.search(part)
                if match:
                    return match.group()
            for j in range(i + 1, len(words)):
                next_word = words[j]
                next_word = re.sub(r'(\d)\s+(\d)', r'\1\2', next_word)
                match = pattern.search(next_word)
                if match:
                    iban = match.group()
                    return iban
    return iban


def get_supplier_ico(words):
    ico = ''
    pattern = re.compile(
        r"\b(?:ICO|1CO:|1ICO|IC|1C0|ICQ)?(\d{8})\b", re.IGNORECASE)
    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('ico', '1co:', '1ico', 'ic:', '1c0', 'icq', 'ic0')]):
            match = pattern.search(word)
            if match:
                ico = match.group(1)
                del words[words.index(word)]
                return ico
            else:
                next_word = words[i + 1]
                match = pattern.search(next_word)
                if match:
                    ico = match.group(1)
                    del words[words.index(next_word)]
                    return ico
    return ico


def get_buyer_ico(words):
    ico = ''
    pattern = re.compile(
        r"\b(?:ICO|1CO:|1ICO|IC|1C0|ICQ)?(\d{8})\b", re.IGNORECASE)
    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('ico', '1co:', '1ico', 'ic:', '1c0', 'icq', 'ic0')]):
            match = pattern.search(word)
            if match:
                ico = match.group(1)
                return ico
            else:
                next_word = words[i + 1]
                match = pattern.search(next_word)
                if match:
                    ico = match.group(1)
                    return ico
    return ico


def parse_text(text):
    words = text.split('\n')
    supplier_data = {}
    buyer_data = {}

    supplier_ico = get_supplier_ico(words)
    if supplier_ico:
        details_url = f"{BACKEND_URL}/get_details?ico={supplier_ico}"
        supplier_details = requests.post(details_url)

        if supplier_details.status_code == 200:
            supplier_data = supplier_details.json()['data']

    buyer_ico = get_buyer_ico(words)
    if buyer_ico:
        details_url = f"{BACKEND_URL}/get_details?ico={buyer_ico}"
        buyer_details = requests.post(details_url)

        if buyer_details.status_code == 200:
            buyer_data = buyer_details.json()['data']

    data = {
        'invoice_number': get_invoice_number(words),
        'var_symbol': get_variable_symbol(words),
        'date_of_issue': get_date_of_issue(words),
        'due_date': get_due_date(words),
        'delivery_date': get_delivery_date(words),
        'payment_method': get_payment_method(words),
        'total_price': get_total_price(words),
        'bank': get_bank(words),
        'swift': get_swift(words),
        'iban': get_iban(words),
        'buyer_ico': buyer_ico,
        'supplier_ico': supplier_ico,
        'supplier_data': supplier_data,
        'buyer_data': buyer_data
    }
    return data
